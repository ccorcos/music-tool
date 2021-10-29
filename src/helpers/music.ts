import { range } from "lodash"

export type Scale = number[]

export const diatonic = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
export const major = [0, 2, 4, 5, 7, 9, 11]

// Note names.
export const [
	root,
	flatTwo,
	two,
	minorThird,
	majorThird,
	fourth,
	tritone,
	fifth,
	flatSixth,
	sixth,
	minorSeven,
	majorSeven,
] = diatonic

/** Note: this will re-base the scale. */
export function mode(scale: Scale, n: number) {
	return range(1, n).reduce((s) => rotateMode(s), scale)
}

export function rotateMode(scale: Scale) {
	const [first, ...rest] = scale
	const offset = [...rest, first + 12]
	const basis = rest[0]
	return offset.map((note) => note - basis)
}

export const aeolian = mode(major, 6)

export function triad(scale: Scale) {
	return range(3).map((i) => scale[i * 2])
}

export const maj = triad(major)
export const min = triad(aeolian)

export function seventhChord(scale: Scale) {
	return range(4).map((i) => scale[i * 2])
}

export const maj7 = seventhChord(major)
export const min7 = seventhChord(aeolian)

export function transposeOctave(scale: Scale, o: number) {
	return scale.map((n) => n + 12 * (o - 1))
}
