import { useState, useCallback, useRef, useEffect } from "react"

export type Point = { x: number; y: number }

export type DraggingState = {
	down: true
	start: Point
	end: Point
}

type DraggableState =
	| {
			down: false
	  }
	| DraggingState

export type OnMouseDown = (e: React.MouseEvent<Element>) => void

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

	// Cleanup just in case.
	useEffect(() => {
		return stopListeners
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
