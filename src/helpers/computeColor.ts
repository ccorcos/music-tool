import chroma from "chroma-js"

export function computeColor(
	color: string,
	args: { active: boolean; hovering: boolean }
) {
	const { active, hovering } = args

	const mixColor = chroma(color).luminance() > 0.5 ? "black" : "white"

	if (active) {
		return chroma.mix(color, mixColor, 0.5).hex()
	} else if (hovering) {
		return chroma.mix(color, mixColor, 0.25).hex()
	} else {
		return color
	}
}
