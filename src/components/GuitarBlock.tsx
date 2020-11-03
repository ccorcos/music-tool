import React, { useState, useCallback, PureComponent } from "react"
import { GuitarBlockState, BlockState } from "../state"
import { DraggableEvents, OnMouseDown } from "./Draggable"
import { Resizer } from "./Resizer"

export function GuitarBlock(props: {
	block: GuitarBlockState
	onUpdate: (block: BlockState) => void
	onMouseDownDrag: OnMouseDown
	dragging: boolean
	onMouseDownResize: OnMouseDown
	resizing: boolean
}) {
	const { block, onMouseDownDrag, dragging, onMouseDownResize } = props
	return (
		<div
			onMouseDown={onMouseDownDrag}
			style={{
				position: "absolute",
				width: block.width,
				height: 120,
				border: "2px solid black",
				background: "white",
				top: block.y,
				left: block.x,
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{ cursor: dragging ? "grabbing" : "grab" }}
				onMouseDown={onMouseDownDrag}
			>
				Guitar
			</div>
			<Resizer onMouseDownResize={onMouseDownResize} />
		</div>
	)
}
