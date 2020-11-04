import { useCallback, useState } from "react"

// TODO: useActive as well.
export function useHover() {
	const [hovered, setHovered] = useState(false)

	const onMouseEnter = useCallback(() => {
		setHovered(true)
	}, [])
	const onMouseLeave = useCallback(() => {
		setHovered(false)
	}, [])

	return [hovered, { onMouseEnter, onMouseLeave }] as const
}
