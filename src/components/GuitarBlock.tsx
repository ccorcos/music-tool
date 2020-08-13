import React, { useState, useCallback, PureComponent } from "react"
import { GuitarBlockState, BlockState } from "../state"
import { DraggableEvents } from "./Draggable"

export function GuitarBlock(props: {
	block: GuitarBlockState
	onUpdate: (block: BlockState) => void
	events: DraggableEvents
}) {
	const { block, events } = props
	return (
		<div
			{...events}
			style={{
				position: "absolute",
				width: 200,
				height: 120,
				border: "2px solid black",
				background: "white",
				top: block.y,
				left: block.x,
			}}
		>
			Guitar
		</div>
	)
}
