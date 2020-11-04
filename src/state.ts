type BlockStateBase = {
	id: string
	x: number
	y: number
	width: number
	scrollLeft: number
}

export type PianoBlockState = BlockStateBase & {
	type: "piano"
	notes?: Array<number>
	shadow?: boolean
}

export type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	notes?: Array<number>
	shadow?: boolean
}

export type BlockState = PianoBlockState | GuitarBlockState
