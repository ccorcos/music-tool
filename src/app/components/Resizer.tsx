import React from "react"
import { OnMouseDown } from "../hooks/useDrag"

export function Resizer(props: { onMouseDownResize: OnMouseDown }) {
	const { onMouseDownResize } = props
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				bottom: 0,
				right: -4,
				width: 6,
				cursor: "ew-resize",
			}}
			onMouseDown={onMouseDownResize}
		/>
	)
}
