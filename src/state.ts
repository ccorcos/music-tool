type BlockStateBase = {
	id: string
	x: number
	y: number
	width: number
	scrollLeft: number
}

export type PianoBlockState = BlockStateBase & {
	type: "piano"
	notes?: Record<number, true>
}

export type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	notes?: Record<number, true>
}

export type BlockState = PianoBlockState | GuitarBlockState
