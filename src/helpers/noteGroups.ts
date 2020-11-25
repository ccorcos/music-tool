import { GroupMembership, NoteGroup, NoteGroups } from "../state"
import { mixColor } from "./color"

export function getNoteColor(args: {
	groupMembership: GroupMembership | undefined
	noteGroups: NoteGroups
	currentNoteGroup: NoteGroup
}) {
	const { groupMembership, noteGroups, currentNoteGroup } = args
	const selected = Boolean(
		groupMembership && Object.keys(groupMembership).length > 0
	)
	let color = currentNoteGroup.color
	let colors = [currentNoteGroup.color]
	if (groupMembership && Object.keys(groupMembership).length > 0) {
		colors = Object.keys(groupMembership).map((groupId) => {
			return noteGroups[groupId].color
		})
		if (colors.length === 1) {
			color = colors[0]
		} else {
			color = colors
				.slice(1)
				.reduce(
					(a, b, i) => mixColor(a, b, 1 - (i + 1 / colors.length)),
					colors[0]
				)
		}
	}

	return { selected, color, colors }
}
