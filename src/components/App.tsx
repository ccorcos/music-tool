import React, { useState, useCallback, PureComponent } from "react"
import { Draggable, Point } from "./Draggable"
import { random } from "lodash"

// - [ ] JSON state, persist to localStorage
// - [ ] draggable blocks
// - [ ] toolbar (reset state, new block)

function randomId() {
	return Math.random().toString().slice(2)
}

type BlockState = {
	id: string
	x: number
	y: number
}

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

	const handleNewBlock = useCallback(() => {
		setState({
			...state,
			blocks: [
				...state.blocks,
				{
					id: randomId(),
					x: Math.random() * 500,
					y: Math.random() * 500,
				},
			],
		})
	}, [state.blocks])

	return (
		<div style={{ height: "100vh", width: "100vw" }}>
			<button onClick={handleNewBlock}>New Block</button>
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
	const { block } = props
	return (
		<Draggable
			onDragEnd={(state) => {
				props.onUpdate({
					...block,
					x: block.x + state.end.x - state.start.x,
					y: block.y + state.end.y - state.start.y,
				})
			}}
		>
			{(events, state) => {
				const offset: Point = { x: block.x, y: block.y }
				if (state.down) {
					offset.x += state.end.x - state.start.x
					offset.y += state.end.y - state.start.y
				}
				console.debug("Block.render", state)
				return (
					<div
						{...events}
						style={{
							position: "absolute",
							width: 200,
							height: 120,
							border: "2px solid black",
							background: "white",
							top: offset.y,
							left: offset.x,
						}}
					></div>
				)
			}}
		</Draggable>
	)
}
