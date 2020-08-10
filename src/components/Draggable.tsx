import { PureComponent } from "react"

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

type DraggableEvents = {
	onMouseDown: (e: React.MouseEvent<Element>) => void
}

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
		console.debug("Draggable.handleMouseDown")

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
		console.debug("Draggable.handleMouseMove")

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
		console.debug("Draggable.handleMouseUp")

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
