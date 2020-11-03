type BlockStateBase = {
	id: string
	x: number
	y: number
	width: number
}

export type PianoBlockState = BlockStateBase & {
	type: "piano"
	notes?: Array<number>
	shadow?: boolean
	scrollLeft?: number
}

export type GuitarBlockState = BlockStateBase & {
	type: "guitar"
	notes?: Array<number>
	shadow?: boolean
	frets?: Array<number | null>
}

export type BlockState = PianoBlockState | GuitarBlockState
