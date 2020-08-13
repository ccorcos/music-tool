import React, { useState, useCallback, PureComponent } from "react"
import { Draggable, Point, DraggableEvents } from "./Draggable"
import { BlockState } from "../state"
import { PianoBlock } from "./PianoBlock"
import { GuitarBlock } from "./GuitarBlock"

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

function randomId() {
	return Math.random().toString().slice(2)
}
