import React from "react"
import { GuitarBlockState, BlockState } from "../state"
import { OnMouseDown } from "../hooks/useDrag"
import { Resizer } from "./Resizer"
import { range } from "lodash"

const height = 90
const frets = 22

const fretColor = "#aaa"
const dotColor = "#aaa"

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
			style={{
				position: "absolute",
				width: block.width,
				height: 144,
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
			<GuitarFretboard />
			<Resizer onMouseDownResize={onMouseDownResize} />
		</div>
	)
}

function GuitarFretboard() {
	const boxes = range(1, frets + 1).map((n) => {
		const i = n % 12
		return (
			<div
				key={n}
				style={{
					display: "inline-block",
					verticalAlign: "top",
					border: `1px solid ${fretColor}`,
					boxSizing: "border-box",
					height,
					width: 25 + (frets - n),
					position: "relative",
				}}
			>
				{(i === 3 || i === 5 || i === 9) && <GuitarDots n={1} />}
				{(i === 7 || i === 0) && <GuitarDots n={2} />}
				{(i === 7 || i === 0 || i === 3 || i === 5 || i === 9) && (
					<div
						style={{ fontSize: 12, lineHeight: "14px", textAlign: "center" }}
					>
						{n}
					</div>
				)}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-evenly",
						marginTop: -5,
						marginBottom: -5,
					}}
				>
					{range(1, 7)
						.reverse() // Delete this for Sean-mode
						.map((n) => {
							return (
								<div
									style={{
										height: 0,
										borderTop: `${n > 3 ? 2 : 1}px solid black`,
										marginLeft: -1,
										marginRight: -1,
									}}
								/>
							)
						})}
				</div>
			</div>
		)
	})

	return (
		<div
			style={{
				position: "relative",
				overflowX: "auto",
				height: height * 1.25,
			}}
		>
			<div
				style={{
					// width: 35 * 22, display: "flex" ,
					whiteSpace: "nowrap",
				}}
			>
				{boxes}
			</div>
		</div>
	)
}

function GuitarDots(props: { n: number }) {
	return (
		<div
			style={{
				display: "flex",
				height: "100%",
				alignItems: "center",
				flexDirection: "column",
				justifyContent: "center",
				gap: 8,
			}}
		>
			{range(0, props.n).map((n) => {
				return (
					<div
						key={n}
						style={{
							background: dotColor,
							height: 8,
							width: 8,
							borderRadius: 8,
						}}
					/>
				)
			})}
		</div>
	)
}
