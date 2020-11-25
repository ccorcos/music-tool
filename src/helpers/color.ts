import chroma from "chroma-js"

export function computeColor(args: {
	onColor: string
	offColor: string
	on: boolean
	active: boolean
	hovering: boolean
}) {
	const { onColor, offColor, on, active, hovering } = args

	const baseColor = on ? onColor : offColor
	const mixColor = on ? offColor : onColor

	if (active) {
		return chroma.mix(baseColor, mixColor, 0.5).hex()
	} else if (hovering) {
		return chroma.mix(baseColor, mixColor, 0.25).hex()
	} else {
		return baseColor
	}
}

export function mixColor(a: string, b: string, ratio: number) {
	return chroma.mix(a, b, ratio).hex()
}
