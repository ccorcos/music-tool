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

const scale = [m.root, m.minorThird, m.fourth, m.fifth, m.minorSeven]
const startChord = [m.root, m.fifth]
// const startChord = [m.root, m.fifth, m.minorSeven]

function incAndWrap(scale: m.Scale, note: number, amount = 1) {
	const index = scale.indexOf(note)
	return scale[(index + amount) % scale.length]
}

// Move the chords my moving note positions.
const chords = range(5).map(
	(i) => m.rotateChord(scale, startChord, i)
	// startChord.map((note) => incAndWrap(scale, note, i))
)

function Row(props: { chord?: m.Scale }) {
	const chord = props.chord || []
	return (
		<div style={{ display: "flex" }} onMouseEnter={() => chord.map(hit)}>
			{range(12).map((octave) =>
				m.diatonic.map((note) => {
					const color = (alt: string) =>
						chord.includes(note + octave * 12)
							? ["#77f", "#99f", "#aaf"][chord.indexOf(note + octave * 12)]
							: scale.includes(note)
							? "#ddd"
							: alt
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

export function Squares() {
	return (
		<div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
			<div style={{ paddingTop: 80, paddingLeft: 40 }} onMouseDown={toggleTone}>
				{chords.map((chord) => (
					<Row chord={chord} />
				))}
			</div>
		</div>
	)
}
