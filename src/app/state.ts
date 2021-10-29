type BlockStateBase = {
	id: string
	x: number
	y: number
	width: number
	scrollLeft: number
}

type NoteGroupId = string
export type NoteGroup = { id: string; color: string }
export type NoteGroups = {
	[id in NoteGroupId]: NoteGroup
}

export type GroupMembership = {
	[id in NoteGroupId]: true
}

export type PianoBlockState = BlockStateBase & {
	type: "piano"
	// TODO: pianoNotes
	notes?: { [midiNote: number]: GroupMembership | undefined }
}

export type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	guitarNotes?: {
		[stringN: number]:
			| { [fretN: number]: GroupMembership | undefined }
			| undefined
	}
}

export type BlockState = PianoBlockState | GuitarBlockState

export type AppState = {
	blocks: Array<BlockState>
	currentNoteGroupId: NoteGroupId
	noteGroups: NoteGroups
}
