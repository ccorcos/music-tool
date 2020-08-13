import React, { useState, useCallback, PureComponent } from "react"
import { Draggable, Point, DraggableEvents } from "./Draggable"
import { random } from "lodash"

// - [x] JSON state, persist to localStorage
// - [x] draggable blocks
// - [ ] toolbar (reset state, new block)
// - [ ] different types of music blocks
//   - [ ] Piano
//    - [ ] Chord Name
//    - [ ] Octave labels
//    - [ ] Save scroll offset + initial offset
//    - [ ] Click notes
//    - [ ] Shadow notes
//    - [ ] Chord prediction
//    - [ ] block type drop-down
//   - [ ] Guitar
//   - [ ] Spiral
//   - [ ] Circle
//   - [ ] Metronome
//   - [ ] Audio file
//   - [ ] Text-based note

type BlockStateBase = {
	id: string
	x: number
	y: number
}

type PianoBlockState = BlockStateBase & {
	type: "piano"
	notes?: Array<number>
	shadow?: boolean
}

type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	notes?: Array<number>
	shadow?: boolean
	frets?: Array<number | null>
}

type BlockState = PianoBlockState | GuitarBlockState

type AppState = {
	blocks: Array<BlockState>
}

function useAppState(): [AppState, (state: AppState) => void] {
	const [state, setState] = useState<AppState>(
		JSON.parse(localStorage.getItem("state") as any) || {
			blocks: [{ id: "1", x: 100, y: 100 }],
		}
	)
	return [
		state,
		(state: AppState) => {
			localStorage.setItem("state", JSON.stringify(state))
			setState(state)
		},
	]
}

export function App() {
	const [state, setState] = useAppState()

	const handleUpdateBlock = useCallback(
		(block: BlockState) => {
			setState({
				...state,
				blocks: state.blocks.map((b) => {
					if (b.id === block.id) {
						return block
					} else {
						return b
					}
				}),
			})
		},
		[state.blocks]
	)

	const handleReset = useCallback(() => {
		setState({ blocks: [] })
	}, [])

	const handleNewPianoBlock = useCallback(() => {
		setState({
			...state,
			blocks: [
				...state.blocks,
				{
					id: randomId(),
					x: Math.random() * 500,
					y: Math.random() * 500,
					type: "piano",
					notes: [],
					shadow: false,
				},
			],
		})
	}, [state.blocks])

	const handleNewGuitarBlock = useCallback(() => {
		setState({
			...state,
			blocks: [
				...state.blocks,
				{
					id: randomId(),
					x: Math.random() * 500,
					y: Math.random() * 500,
					type: "guitar",
					notes: [],
					frets: [],
					shadow: false,
				},
			],
		})
	}, [state.blocks])

	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<button onClick={handleReset}>Reset</button>
			<button onClick={handleNewPianoBlock}>Piano Block</button>
			<button onClick={handleNewGuitarBlock}>Guitar Block</button>
			{state.blocks.map((block) => {
				return (
					<Block key={block.id} block={block} onUpdate={handleUpdateBlock} />
				)
			})}
		</div>
	)
}

export function Block(props: {
	block: BlockState
	onUpdate: (block: BlockState) => void
}) {
	return (
		<Draggable
			onDragEnd={(state) => {
				props.onUpdate({
					...props.block,
					x: props.block.x + state.end.x - state.start.x,
					y: props.block.y + state.end.y - state.start.y,
				})
			}}
		>
			{(events, state) => {
				let block = props.block
				if (state.down) {
					block = {
						...block,
						x: props.block.x + state.end.x - state.start.x,
						y: props.block.y + state.end.y - state.start.y,
					}
				}
				console.debug("Block.render", state)

				if (block.type === "piano") {
					return (
						<PianoBlock
							block={block}
							onUpdate={props.onUpdate}
							events={events}
						/>
					)
				} else if (block.type === "guitar") {
					return (
						<GuitarBlock
							block={block}
							onUpdate={props.onUpdate}
							events={events}
						/>
					)
				} else {
					return <div />
				}
			}}
		</Draggable>
	)
}

function GuitarBlock(props: {
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

function PianoBlock(props: {
	block: PianoBlockState
	onUpdate: (block: BlockState) => void
	events: DraggableEvents
}) {
	const { block, onUpdate, events } = props
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
				overflowX: "auto",
			}}
		>
			Piano
			<PianoKeyboard block={block} onUpdate={onUpdate} />
		</div>
	)
}

function PianoKeyboard(props: {
	block: PianoBlockState
	onUpdate: (block: BlockState) => void
	showMidiNote?: boolean
}) {
	const { showMidiNote, block, onUpdate } = props

	const octaves = 8
	const width = 20
	const height = 90

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
				<div
					key={`white-${i}`}
					style={{
						border: "1px solid black",
						boxSizing: "border-box",
						height: height,
						width: width,
						background: "white",
						position: "absolute",
						top: 0,
						left: i * width,
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

					{whiteKeyIndex === 0 && (
						<div
							style={{
								position: "absolute",
								top: "100%",
								width: "100%",
								textAlign: "center",
								fontSize: width * 0.5,
							}}
						>
							{`C${octave - 1}`}
						</div>
					)}
				</div>
			)
		})

	const blackNotes = Array(octaves * 5)
		.fill(0)
		.map((_, i) => {
			// Fraction of a white note.
			const widthFraction = 0.5
			const heightFraction = 0.55

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
				<div
					key={`black-${i}`}
					style={{
						border: "1px solid black",
						boxSizing: "border-box",
						height: height * heightFraction,
						width: width * widthFraction,
						marginBottom: height * (1 - heightFraction),
						background: "black",
						position: "absolute",
						top: 0,
						left: offset,
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
		})

	return (
		<div
			style={{
				width: (width * octaves * 7) / 12,
			}}
		>
			{whiteNotes}
			{blackNotes}
		</div>
	)
}

function randomId() {
	return Math.random().toString().slice(2)
}
