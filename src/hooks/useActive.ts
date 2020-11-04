import { useCallback, useState, useEffect } from "react"

export function useActive() {
	const [active, setActive] = useState(false)

	const onMouseUp = useCallback(() => {
		setActive(false)
		window.removeEventListener("mouseup", onMouseUp)
	}, [])

	const onMouseDown = useCallback(() => {
		setActive(true)
		window.addEventListener("mouseup", onMouseUp)
	}, [])

	useEffect(() => {
		return () => {
			window.removeEventListener("mouseup", onMouseUp)
		}
	}, [])

	return [active, { onMouseDown, onMouseUp }] as const
}
