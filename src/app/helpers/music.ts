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
	return range(1, n).reduce((s) => rotateModeOnce(s), scale)
}

export function rotateUp(scale: Scale) {
	const [first, ...rest] = scale
	const offset = [...rest, first + 12]
	return offset
}

export function rotateChord(scale: Scale, chord: Scale, n = 1) {
	return range(0, n).reduce((c) => rotateChordOnce(scale, c), chord)
}

// console.log(rotateChordOnce([1, 4, 6], [1, 6]), [4, 13])
// console.log(rotateChordOnce([1, 4, 6], [4, 13]), [6, 16])

export function rotateChordOnce(scale: Scale, chord: Scale) {
	return chord.map((note) => {
		const nextIndex = scale.indexOf(note % 12) + 1
		const nextNote = scale[nextIndex % scale.length]

		// console.log(nextIndex, scale.length)
		const octave = Math.floor(nextIndex / scale.length) + Math.floor(note / 12)

		// console.log(note, "->", nextNote + octave * 12)
		return nextNote + octave * 12
	})
}

export function rebase(scale: Scale) {
	const basis = scale[0]
	return scale.map((note) => note - basis)
}

export function rotateModeOnce(scale: Scale) {
	return rebase(rotateUp(scale))
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
