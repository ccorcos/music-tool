import { GroupMembership, NoteGroup, NoteGroups } from "../state"
import { computeColor, mixColors } from "./color"

export function getNoteColors(args: {
	groupMembership: GroupMembership | undefined
	noteGroups: NoteGroups
}) {
	const { groupMembership, noteGroups } = args
	if (groupMembership && Object.keys(groupMembership).length > 0) {
		return Object.keys(groupMembership).map((groupId) => {
			return noteGroups[groupId].color
		})
	}
	return []
}

export function getNoteColor(args: {
	selected: boolean
	currentColor: string
	noteColors: Array<string>
	active: boolean
	hovering: boolean
	baseColor: string
}) {
	const {
		selected,
		currentColor,
		noteColors,
		active,
		hovering,
		baseColor,
	} = args
	let base = noteColors
	let mix = noteColors
	if (selected) {
		// If selected, remove the color from the mix..
		mix = mix.filter((color) => color !== currentColor)
	} else {
		// If not selected, add current color to the mix.
		mix = [...mix, currentColor]
	}

	if (base.length === 0) {
		base = [selected ? currentColor : baseColor]
	}
	if (mix.length === 0) {
		mix = [selected ? baseColor : currentColor]
	}
	const color = computeColor({
		baseColor: mixColors(...base),
		mixColor: mixColors(...mix),
		hovering,
		active,
	})
	return color
}
