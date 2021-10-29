import { range } from "lodash"
import React from "react"
import * as m from "../helpers/music"
import { hit, toggleTone } from "../helpers/sound"

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

function Row(props: {
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
								borderColor: color("#eee"),
								background: color("white"),
							}}
						/>
					)
				})
			)}
		</div>
	)
}

function Squares2(props: {
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
				<Row {...props} chord={chord} />
			))}
		</div>
	)
}

export function Squares() {
	// Should we repeat notes in every octave?
	const REPEAT = false
	const NORMALIZE = true

	const scale = [m.root, m.minorThird, m.fourth, m.fifth, m.minorSeven]
	// const startChord = [m.root, m.fifth]
	// const startChord = [m.root, m.fourth, m.minorSeven]
	const startChord = [m.root, m.fifth, m.minorSeven]

	const variant = (chord: m.Scale) => (
		<Squares2
			scale={scale}
			chord={chord}
			repeat={REPEAT}
			normalize={NORMALIZE}
		/>
	)

	return (
		<div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
			<div style={{ paddingTop: 80, paddingLeft: 40 }} onMouseDown={toggleTone}>
				{variant([m.root, m.fourth, m.minorSeven])}
				{/* {variant([m.root, m.fourth])} */}
				{/* {variant([m.root, m.fifth])} */}
				{/* {variant([m.root, m.minorSeven])} */}
			</div>
		</div>
	)
}
