import React, {
	createRef,
	useCallback,
	useMemo,
	useRef,
	useEffect,
} from "react"
import { GuitarBlockState, BlockState, NoteGroup, NoteGroups } from "../state"
import { OnMouseDown } from "../hooks/useDrag"
import { Resizer } from "./Resizer"
import { range, throttle } from "lodash"
import { useHover } from "../hooks/useHover"
import { useActive } from "../hooks/useActive"
import { computeColor } from "../helpers/color"

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
	currentNoteGroup: NoteGroup
	noteGroups: NoteGroups
}) {
	const {
		block,
		onUpdate,
		onMouseDownDrag,
		dragging,
		onMouseDownResize,
		currentNoteGroup,
		noteGroups,
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
				Guitar
			</div>
			<GuitarFretboard
				block={block}
				onUpdate={onUpdate}
				currentNoteGroup={currentNoteGroup}
				noteGroups={noteGroups}
			/>
			<Resizer onMouseDownResize={onMouseDownResize} />
		</div>
	)
}

function GuitarFretboard(props: {
	block: GuitarBlockState
	onUpdate: (block: BlockState) => void
	currentNoteGroup: NoteGroup
	noteGroups: NoteGroups
}) {
	const { block, onUpdate, currentNoteGroup } = props

	// TODO: this is gross. onUpdate should have a separate id argument
	const ref = useRef(block)
	ref.current = block

	const onToggleNote = useCallback(
		(args: { stringN: number; fretN: number }) => {
			const { stringN, fretN } = args
			// TODO: Use an immutable helper function for this?
			const block = { ...ref.current }
			block.guitarNotes = { ...(block.guitarNotes || {}) }
			block.guitarNotes[stringN] = { ...(block.guitarNotes[stringN] || {}) }
			if (block.guitarNotes[stringN]![fretN]) {
				delete block.guitarNotes[stringN]![fretN]
			} else {
				block.guitarNotes[stringN]![fretN] = currentNoteGroup.id
			}
			onUpdate({ ...block })
		},
		[currentNoteGroup.id]
	)

	const boxes = range(1, frets + 1).map((fretN) => {
		const i = fretN % 12
		return (
			<div
				key={fretN}
				style={{
					display: "inline-block",
					verticalAlign: "top",
					border: `1px solid ${fretColor}`,
					boxSizing: "border-box",
					height,
					width: 25 + (frets - fretN),
					position: "relative",
				}}
			>
				{(i === 3 || i === 5 || i === 9) && <GuitarDots n={1} />}
				{(i === 7 || i === 0) && <GuitarDots n={2} />}
				{(i === 7 || i === 0 || i === 3 || i === 5 || i === 9) && (
					<div
						style={{ fontSize: 12, lineHeight: "14px", textAlign: "center" }}
					>
						{fretN}
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
					}}
				>
					{range(1, 7)
						.reverse() // Delete this for Sean-mode (right handed)
						.map((stringN) => {
							let midiNote = 28
							midiNote += (stringN - 1) * 5
							if (stringN === 5) {
								midiNote += 1
							} else if (stringN === 6) {
								midiNote += 2
							}
							midiNote += fretN

							// If the note is already selected for a given note group, show that color.
							// Otherwise, show the current note color.

							const noteGroupId = block.guitarNotes?.[stringN]?.[fretN]
							const noteGroup = noteGroupId
								? props.noteGroups[noteGroupId]
								: currentNoteGroup

							return (
								<GuitarString
									stringN={stringN}
									fretN={fretN}
									selected={Boolean(noteGroupId)}
									onToggleNote={onToggleNote}
									noteColor={noteGroup.color}
								/>
							)
						})}
				</div>
			</div>
		)
	})

	return (
		<GuitarScroller block={props.block} onUpdate={props.onUpdate}>
			<div
				style={{
					// width: 35 * 22, display: "flex" ,
					whiteSpace: "nowrap",
				}}
			>
				{boxes}
			</div>
		</GuitarScroller>
	)
}

/** `n=6` is the low E string. */
function GuitarString(props: {
	stringN: number
	fretN: number
	selected: boolean
	onToggleNote: (args: { stringN: number; fretN: number }) => void
	noteColor: string
}) {
	const { stringN, fretN, selected, onToggleNote, noteColor } = props

	const thickness = stringN > 3 ? 2 : 1

	const [hovering, hoverEvents] = useHover()
	const [active, activeEvents] = useActive()

	const handleClick = useCallback(() => {
		onToggleNote({ stringN, fretN })
	}, [stringN, fretN, onToggleNote])

	let color = "transparent"
	if (selected || hovering || active) {
		color = computeColor({
			onColor: noteColor,
			offColor: "white",
			on: selected,
			hovering,
			active,
		})
	}

	return (
		<div
			{...hoverEvents}
			{...activeEvents}
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
			}}
			onClick={handleClick}
		>
			<div
				style={{
					height: 0,
					borderTop: `${thickness}px solid black`,
					marginLeft: -1,
					marginRight: -1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						marginTop: -thickness,
						width: 12,
						height: 12,
						borderRadius: 12,
						background: color,
					}}
				/>
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

// TODO: consolidate with PianoScroller?
function GuitarScroller(props: {
	block: GuitarBlockState
	onUpdate: (block: BlockState) => void
	children: JSX.Element
}) {
	const div = createRef<HTMLDivElement>()

	const block = useRef(props.block)
	block.current = props.block

	const setScrollLeft = useMemo(() => {
		return throttle((scrollLeft: number) => {
			props.onUpdate({
				...block.current,
				scrollLeft,
			})
		}, 100)
	}, [])

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement, UIEvent>) => {
			setScrollLeft(e.currentTarget!.scrollLeft)
		},
		[]
	)

	useEffect(() => {
		div.current!.scrollLeft = props.block.scrollLeft || 0
	}, [])

	return (
		<div
			ref={div}
			style={{
				position: "relative",
				overflowX: "auto",
				height: height * 1.25,
			}}
			onScroll={handleScroll}
		>
			{props.children}
		</div>
	)
}

function getMidiNote(args: { stringN: number; fretN: number }) {
	const { stringN, fretN } = args
	let midiNote = 28
	midiNote += (stringN - 1) * 5
	if (stringN === 5) {
		midiNote += 1
	} else if (stringN === 6) {
		midiNote += 2
	}
	midiNote += fretN
	return midiNote
}
