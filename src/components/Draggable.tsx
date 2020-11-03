import { PureComponent, useEffect, useState, useCallback, useRef } from "react"

export type Point = { x: number; y: number }

export type DraggingState = {
	down: true
	start: Point
	end: Point
}

export type DraggableState =
	| {
			down: false
	  }
	| DraggingState

export type DraggableEvents = {
	onMouseDown: (e: React.MouseEvent<Element>) => void
}

export type OnMouseDown = (e: React.MouseEvent<Element>) => void

type DraggableProps = {
	onDragEnd?: (store: DraggingState) => void
	children: (events: DraggableEvents, state: DraggableState) => JSX.Element
}

export class Draggable extends PureComponent<DraggableProps, DraggableState> {
	state: DraggableState = { down: false }

	componentWillUnmount() {
		this.stopListeners()
	}

	startListeners() {
		window.addEventListener("mousemove", this.handleMouseMove)
		window.addEventListener("mouseup", this.handleMouseUp)
	}

	stopListeners() {
		window.removeEventListener("mousemove", this.handleMouseMove)
		window.removeEventListener("mouseup", this.handleMouseUp)
	}

	handleMouseDown = (e: React.MouseEvent<Element>) => {
		// console.debug("Draggable.handleMouseDown")

		// Only respond to left-clicks
		if (e.button !== 0) {
			return
		}
		const point = {
			x: e.pageX,
			y: e.pageY,
		}
		this.setState({
			down: true,
			start: point,
			end: point,
		})
		this.startListeners()
		e.stopPropagation()
		e.preventDefault()
	}

	handleMouseMove = (e: MouseEvent) => {
		// console.debug("Draggable.handleMouseMove")

		if (this.state.down) {
			const point = {
				x: e.pageX,
				y: e.pageY,
			}
			this.setState({
				...this.state,
				end: point,
			})
		}
	}

	handleMouseUp = (e: MouseEvent) => {
		// console.debug("Draggable.handleMouseUp")

		if (this.state.down) {
			if (this.props.onDragEnd) {
				this.props.onDragEnd(this.state)
			}
			this.setState({
				down: false,
			})
			this.stopListeners()
		}
	}

	render() {
		return this.props.children(
			{
				onMouseDown: this.handleMouseDown,
			},
			this.state
		)
	}
}

export function useDrag(args: { onDragEnd?: (store: DraggingState) => void }) {
	const [state, setState] = useState<DraggableState>({ down: false })

	const handleMouseMove = useCallback((e: MouseEvent) => {
		// console.debug("Draggable.handleMouseMove")
		setState((state) => {
			if (state.down) {
				const point = {
					x: e.pageX,
					y: e.pageY,
				}
				return {
					...state,
					end: point,
				}
			} else {
				return state
			}
		})
	}, [])

	const onDragEndRef = useRef(args.onDragEnd)
	onDragEndRef.current = args.onDragEnd

	const handleMouseUp = useCallback((e: MouseEvent) => {
		// console.debug("Draggable.handleMouseUp")
		setState((state) => {
			if (state.down) {
				const onDragEnd = onDragEndRef.current
				if (onDragEnd) {
					onDragEnd(state)
				}
				stopListeners()
				return { down: false }
			} else {
				return state
			}
		})
	}, [])

	const startListeners = useCallback(() => {
		window.addEventListener("mousemove", handleMouseMove)
		window.addEventListener("mouseup", handleMouseUp)
	}, [])

	const stopListeners = useCallback(() => {
		window.removeEventListener("mousemove", handleMouseMove)
		window.removeEventListener("mouseup", handleMouseUp)
	}, [])

	const handleMouseDown = useCallback((e: React.MouseEvent<Element>) => {
		// console.debug("Draggable.handleMouseDown")

		// Only respond to left-clicks
		if (e.button !== 0) {
			return
		}
		startListeners()
		e.stopPropagation()
		e.preventDefault()

		setState((state) => {
			const point = {
				x: e.pageX,
				y: e.pageY,
			}
			return {
				down: true,
				start: point,
				end: point,
			}
		})
	}, [])

	return [state, handleMouseDown] as const
}
