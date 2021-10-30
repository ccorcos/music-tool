import { range } from "lodash"
import React from "react"
import { mixColor } from "../helpers/color"
import * as m from "../helpers/music"
import { hit } from "../helpers/sound"

const size = 20

const noteStyle: React.CSSProperties = {
	flexShrink: 0,
	width: size,
	height: size,
	textAlign: "center",
	border: "1px solid black",
	boxSizing: "border-box",
	margin: 0,
}

export function SquaresRow(props: {
	scale: m.Scale
	chord: m.Scale
	// Should we repeat notes in every octave?
	repeat: boolean
	// Should we normalize the chord to the interval?
	normalize: boolean
}) {
	const { chord, scale, repeat, normalize } = props

	return (
		<div style={{ display: "flex" }} onMouseEnter={() => chord.map(hit)}>
			{range(12).map((octave) =>
				m.diatonic.map((octaveNote) => {
					// normalized view.
					if (normalize && octaveNote + octave * 12 < chord[0] - 12) return null

					const note = octaveNote + octave * 12

					const color = (alt: string) => {
						const i = chord.findIndex((n) =>
							repeat ? octaveNote === n % 12 : note === n
						)

						return i !== -1
							? ["#77f", "#99f", "#aaf"][i]
							: scale.includes(octaveNote)
							? "#ddd"
							: alt
					}
					return (
						<div
							style={{
								...noteStyle,
								borderColor:
									octaveNote === 0
										? mixColor(color("#eee"), "red", 0.4)
										: color("#eee"),
								background: color("white"),
							}}
						/>
					)
				})
			)}
		</div>
	)
}

export function SquaresRotate(props: {
	scale: m.Scale
	chord: m.Scale
	// Should we repeat notes in every octave?
	repeat: boolean
	// Should we normalize the chord to the interval?
	normalize: boolean
}) {
	const { scale, chord: startChord } = props

	// Move the chords my moving note positions.
	const chords = range(scale.length * 3, scale.length * 7).map((i) =>
		m.rotateChord(scale, startChord, i)
	)

	return (
		<div style={{ marginBottom: 40 }}>
			{chords.map((chord) => (
				<SquaresRow {...props} chord={chord} />
			))}
		</div>
	)
}
