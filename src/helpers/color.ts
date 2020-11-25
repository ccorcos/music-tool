import chroma from "chroma-js"

export function computeColor(args: {
	baseColor: string
	mixColor: string
	active: boolean
	hovering: boolean
}) {
	const { baseColor, mixColor, active, hovering } = args
	if (active) {
		return chroma.mix(baseColor, mixColor, 0.5).hex()
	} else if (hovering) {
		return chroma.mix(baseColor, mixColor, 0.3).hex()
	} else {
		return baseColor
	}
}

export function mixColor(a: string, b: string, ratio: number) {
	return chroma.mix(a, b, ratio).hex()
}

export function mixColors(...colors: Array<string>) {
	if (colors.length === 0) {
		throw new Error("Need more than one color.")
	}
	if (colors.length === 1) {
		return colors[0]
	}
	return colors
		.slice(1)
		.reduce((a, b, i) => mixColor(a, b, 1 - (i + 1 / colors.length)), colors[0])
}
