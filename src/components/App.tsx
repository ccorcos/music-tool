import React, { useState, useCallback, useEffect } from "react"
import { useDrag } from "../hooks/useDrag"
import { AppState, BlockState, NoteGroup, NoteGroups } from "../state"
import { PianoBlock } from "./PianoBlock"
import { GuitarBlock } from "./GuitarBlock"
import { NoteGroupSwitcher } from "./NoteGroupSwitcher"

const stateKey = "state8"

const initialState: AppState = {
	blocks: [],
	currentNoteGroupId: "1",
	noteGroups: {
		"1": { id: "1", color: "#4e43ec" },
		"2": { id: "2", color: "#ec428c" },
		"3": { id: "3", color: "#e1ec42" },
		"4": { id: "4", color: "#42eca2" },
	},
}

// https://pinetools.com/tetrad-color-scheme
// #4e43ec
// #ec428c
// #e1ec42
// #42eca2
// #2718f5
// #f51777
// #e6f517
// #17f595

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

	const handleSetCurrentNoteGroupId = useCallback(
		(currentNoteGroupId: string) => {
			setState((state) => ({
				...state,
				currentNoteGroupId,
			}))
		},
		[]
	)

	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<div style={{ padding: "1em", display: "flex", gap: "0.5em" }}>
				<button onClick={handleNewPianoBlock}>Piano Block</button>
				<button onClick={handleNewGuitarBlock}>Guitar Block</button>
				<NoteGroupSwitcher
					noteGroups={state.noteGroups}
					currentNoteGroupId={state.currentNoteGroupId}
					onSetCurrentNoteGroupId={handleSetCurrentNoteGroupId}
				/>
				<div style={{ flex: 1 }}></div>
				<button onClick={handleReset}>Reset</button>
			</div>
			{state.blocks.map((block) => {
				return (
					<Block
						key={block.id}
						block={block}
						onUpdate={handleUpdateBlock}
						currentNoteGroup={state.noteGroups[state.currentNoteGroupId]}
						noteGroups={state.noteGroups}
					/>
				)
			})}
		</div>
	)
}

export function Block(props: {
	block: BlockState
	onUpdate: (block: BlockState) => void
	currentNoteGroup: NoteGroup
	noteGroups: NoteGroups
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
				currentNoteGroup={props.currentNoteGroup}
				noteGroups={props.noteGroups}
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
				currentNoteGroup={props.currentNoteGroup}
				noteGroups={props.noteGroups}
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
