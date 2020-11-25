import React, { useCallback } from "react"
import { computeColor, mixColor } from "../helpers/color"
import { useActive } from "../hooks/useActive"
import { useHover } from "../hooks/useHover"
import { NoteGroup, NoteGroups } from "../state"

export function NoteGroupSwitcher(props: {
	noteGroups: NoteGroups
	currentNoteGroupId: string
	onSetCurrentNoteGroupId: (noteGroupId: string) => void
}) {
	return (
		<div
			style={{
				display: "flex",
				gap: 4,
				alignItems: "center",
			}}
		>
			{Object.entries(props.noteGroups).map(([id, noteGroup]) => {
				return (
					<NoteGroupSwatch
						key={id}
						noteGroup={noteGroup}
						selected={props.currentNoteGroupId === id}
						onSetCurrentNoteGroupId={props.onSetCurrentNoteGroupId}
					/>
				)
			})}
		</div>
	)
}

function NoteGroupSwatch(props: {
	noteGroup: NoteGroup
	selected: boolean
	onSetCurrentNoteGroupId: (noteGroupId: string) => void
}) {
	const [hovering, hoverEvents] = useHover()
	const [active, activeEvents] = useActive()

	// No hover effect when selected.
	const baseColor = mixColor(props.noteGroup.color, "white", 0.1)
	const color = props.selected
		? baseColor
		: computeColor({
				onColor: mixColor(props.noteGroup.color, "white", 0.1),
				offColor: mixColor(props.noteGroup.color, "white", 0.6),
				on: props.selected,
				active,
				hovering,
		  })

	const handleClick = useCallback(() => {
		props.onSetCurrentNoteGroupId(props.noteGroup.id)
	}, [props.noteGroup.id])

	return (
		<div
			onClick={props.selected ? undefined : handleClick}
			style={{
				borderRadius: 99,
				height: 20,
				width: 20,
				background: props.noteGroup.color,
				cursor: props.selected ? undefined : "pointer",
				border: `2px solid ${color}`,
				boxSizing: "border-box",
			}}
			{...hoverEvents}
			{...activeEvents}
		></div>
	)
}
