import React, { useState, useCallback, useEffect } from "react"
import { useDrag } from "../hooks/useDrag"
import { AppState, BlockState } from "../state"
import { PianoBlock } from "./PianoBlock"
import { GuitarBlock } from "./GuitarBlock"

const stateKey = "state3"

const initialState: AppState = {
	blocks: [],
	currentNoteGroup: "1",
	noteGroups: {
		"1": { color: "red" },
		"2": { color: "green" },
		"3": { color: "blue" },
	},
}

// const currentNoteGroup = createContext(initialState.currentNoteGroup)
// const noteGroups = createContext(initialState.noteGroups)

function useAppState() {
	const [state, setState] = useState<AppState>(
		JSON.parse(localStorage.getItem(stateKey) as any) || initialState
	)

	useEffect(() => {
		localStorage.setItem(stateKey, JSON.stringify(state))
	}, [state])

	return [state, setState] as const
}

export function App() {
	const [state, setState] = useAppState()

	// TODO: pass id separately, handle delete, also updater arg.
	const handleUpdateBlock = useCallback((block: BlockState) => {
		setState((state) => ({
			...state,
			blocks: state.blocks.map((b) => {
				if (b.id === block.id) {
					return block
				} else {
					return b
				}
			}),
		}))
	}, [])

	const handleReset = useCallback(() => {
		setState(initialState)
	}, [])

	const handleNewPianoBlock = useCallback(() => {
		setState((state) => ({
			...state,
			blocks: [
				...state.blocks,
				{
					id: randomId(),
					x: Math.random() * 500,
					y: Math.random() * 500,
					type: "piano",
					notes: [],
					width: 220,
					scrollLeft: 0,
				},
			],
		}))
	}, [])

	const handleNewGuitarBlock = useCallback(() => {
		setState((state) => ({
			...state,
			blocks: [
				...state.blocks,
				{
					id: randomId(),
					x: Math.random() * 500,
					y: Math.random() * 500,
					type: "guitar",
					notes: [],
					width: 200,
					scrollLeft: 0,
				},
			],
		}))
	}, [])

	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<div style={{ padding: "1em", display: "flex", gap: "0.5em" }}>
				<button onClick={handleNewPianoBlock}>Piano Block</button>
				<button onClick={handleNewGuitarBlock}>Guitar Block</button>
				<div style={{ width: 24 }}></div>
				<div style={{ flex: 1 }}></div>
				<button onClick={handleReset}>Reset</button>
			</div>
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
	const [dragBlock, onMouseDownDrag, dragging] = useDragBlock({
		block: props.block,
		onUpdate: props.onUpdate,
	})

	const [block, onMouseDownResize, resizing] = useResizeBlock({
		block: dragBlock,
		onUpdate: props.onUpdate,
	})

	if (block.type === "piano") {
		return (
			<PianoBlock
				block={block}
				onUpdate={props.onUpdate}
				onMouseDownDrag={onMouseDownDrag}
				dragging={dragging}
				onMouseDownResize={onMouseDownResize}
				resizing={resizing}
			/>
		)
	} else if (block.type === "guitar") {
		return (
			<GuitarBlock
				block={block}
				onUpdate={props.onUpdate}
				onMouseDownDrag={onMouseDownDrag}
				dragging={dragging}
				onMouseDownResize={onMouseDownResize}
				resizing={resizing}
			/>
		)
	} else {
		return <div />
	}
}

function randomId() {
	return Math.random().toString().slice(2)
}

function useDragBlock(args: {
	block: BlockState
	onUpdate: (block: BlockState) => void
}) {
	let block = args.block

	const [state, onMouseDown] = useDrag({
		onDragEnd: (state) => {
			args.onUpdate({
				...args.block,
				x: args.block.x + state.end.x - state.start.x,
				y: args.block.y + state.end.y - state.start.y,
			})
		},
	})

	if (state.down) {
		block = {
			...block,
			x: args.block.x + state.end.x - state.start.x,
			y: args.block.y + state.end.y - state.start.y,
		}
	}

	return [block, onMouseDown, state.down] as const
}

function useResizeBlock(args: {
	block: BlockState
	onUpdate: (block: BlockState) => void
}) {
	let block = args.block

	const [state, onMouseDown] = useDrag({
		onDragEnd: (state) => {
			args.onUpdate({
				...args.block,
				width: args.block.width + state.end.x - state.start.x,
			})
		},
	})

	if (state.down) {
		block = {
			...block,
			width: args.block.width + state.end.x - state.start.x,
		}
	}

	return [block, onMouseDown, state.down] as const
}
