import React, { PureComponent, createRef } from "react"
import { OnMouseDown } from "../hooks/useDrag"
import { PianoBlockState, BlockState } from "../state"
import { throttle } from "lodash"
import { Resizer } from "./Resizer"
import { useHover } from "../hooks/useHover"

export function PianoBlock(props: {
	block: PianoBlockState
	onUpdate: (block: BlockState) => void
	onMouseDownDrag: OnMouseDown
	dragging: boolean
	onMouseDownResize: OnMouseDown
	resizing: boolean
}) {
	const {
		block,
		onUpdate,
		onMouseDownDrag,
		dragging,
		onMouseDownResize,
		resizing,
	} = props
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
				Piano
			</div>
			<PianoScroller block={block} onUpdate={onUpdate}>
				<PianoKeyboard block={block} onUpdate={onUpdate} showMidiNote={false} />
			</PianoScroller>
			<Resizer onMouseDownResize={onMouseDownResize} />
		</div>
	)
}

type PianoKeyboardProps = {
	block: PianoBlockState
	onUpdate: (block: BlockState) => void
	showMidiNote: boolean
}

const octaves = 8
const width = 20
const height = 90

// Fraction of a white note.
const widthFraction = 0.5
const heightFraction = 0.55

function PianoKeyboard(props: PianoKeyboardProps) {
	const { showMidiNote, block, onUpdate } = props

	const whiteNotes = Array(octaves * 7)
		.fill(0)
		.map((_, i) => {
			// Piano key indexes (p):
			//  1 3   6 8 10
			// 0 2 4 5 7 9 11
			// White key indexes (w):
			// 0 1 2 3 4 5
			//
			// p = w * 2 - (w > 2 ? 1 : 0)
			const whiteKeyIndex = i % 7
			const pianoKeyIndex = whiteKeyIndex * 2 - (whiteKeyIndex > 2 ? 1 : 0)

			const octave = Math.floor(i / 7)
			const midiNote = octave * 12 + pianoKeyIndex

			return (
				<WhiteNote
					key={`white-${i}`}
					leftPx={i * width}
					showMidiNote={showMidiNote}
					midiNote={midiNote}
				/>
			)
		})

	const blackNotes = Array(octaves * 5)
		.fill(0)
		.map((_, i) => {
			// Piano key indexes (p):
			//  1 3   6 8 10
			// 0 2 4 5 7 9 11
			// Black key indexes (b):
			//  0 1   2 3 4
			//
			// p = b * 2 + (b > 1 ? 2 : 1)
			const blackNoteIndex = i % 5
			const pianoKeyIndex = blackNoteIndex * 2 + (blackNoteIndex > 1 ? 2 : 1)

			const octave = Math.floor(i / 5)
			const midiNote = octave * 12 + pianoKeyIndex

			const keyOffset =
				(1 -
					widthFraction / 2 +
					(blackNoteIndex > 1 ? 1 : 0) +
					blackNoteIndex) *
				width
			const octaveOffset = octave * width * 7
			const offset = octaveOffset + keyOffset

			return (
				<BlackNote
					key={`black-${i}`}
					leftPx={offset}
					showMidiNote={showMidiNote}
					midiNote={midiNote}
				/>
			)
		})

	return (
		<div style={{ width: (width * octaves * 7) / 12 }}>
			{whiteNotes}
			{blackNotes}
		</div>
	)
}

function BlackNote(props: {
	leftPx: number
	showMidiNote: boolean
	midiNote: number
}) {
	const { leftPx, showMidiNote, midiNote } = props
	const [hovering, events] = useHover()
	return (
		<div
			{...events}
			style={{
				border: "1px solid black",
				boxSizing: "border-box",
				height: height * heightFraction,
				width: width * widthFraction,
				marginBottom: height * (1 - heightFraction),
				background: hovering ? "gray" : "black",
				position: "absolute",
				top: 0,
				left: leftPx,
			}}
		>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					textAlign: "center",
					fontSize: width * widthFraction * 0.8,
					color: "white",
				}}
			>
				{showMidiNote && midiNote}
			</div>
		</div>
	)
}

function WhiteNote(props: {
	leftPx: number
	showMidiNote: boolean
	midiNote: number
}) {
	const { leftPx, showMidiNote, midiNote } = props
	const [hovering, events] = useHover()

	const octave = Math.floor(midiNote / 12)
	const isC = midiNote % 12 === 0

	return (
		<div
			{...events}
			style={{
				border: "1px solid black",
				boxSizing: "border-box",
				height: height,
				width: width,
				background: hovering ? "gray" : "white",
				position: "absolute",
				top: 0,
				left: leftPx,
			}}
		>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					width: "100%",
					textAlign: "center",
					fontSize: width * 0.6,
				}}
			>
				{showMidiNote && midiNote}
			</div>

			{isC && (
				<div
					style={{
						position: "absolute",
						top: "100%",
						width: "100%",
						textAlign: "center",
						fontSize: 12,
					}}
				>
					{`C${octave - 1}`}
				</div>
			)}
		</div>
	)
}

class PianoScroller extends PureComponent<{
	block: PianoBlockState
	onUpdate: (block: BlockState) => void
	children: JSX.Element
}> {
	private div = createRef<HTMLDivElement>()

	render() {
		return (
			<div
				ref={this.div}
				style={{
					position: "relative",
					overflowX: "auto",
					height: height * 1.25,
				}}
				onScroll={this.handleScroll}
			>
				{this.props.children}
			</div>
		)
	}

	componentDidMount() {
		this.div.current!.scrollLeft = this.props.block.scrollLeft || 0
	}

	private handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
		this.setScrollLeft(e.currentTarget!.scrollLeft)
	}

	private setScrollLeft = throttle((scrollLeft: number) => {
		this.props.onUpdate({
			...this.props.block,
			scrollLeft,
		})
	}, 100)
}
