type BlockStateBase = {
	id: string
	x: number
	y: number
	width: number
	scrollLeft: number
}

export type PianoBlockState = BlockStateBase & {
	type: "piano"
	// TODO: pianoNotes
	notes?: { [midiNote: number]: true | undefined }
}

export type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	guitarNotes?: {
		[stringN: number]: { [fretN: number]: true | undefined } | undefined
	}
}

export type BlockState = PianoBlockState | GuitarBlockState
