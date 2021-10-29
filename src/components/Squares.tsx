import { range } from "lodash"
import React from "react"
import * as m from "../helpers/music"
import { hit, startTone } from "../helpers/sound"

const size = 20

const noteStyle: React.CSSProperties = {
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

function inc(scale: m.Scale, note: number, amount = 1) {
	const index = scale.indexOf(note)
	return scale[(index + amount) % scale.length]
}

// Move the chords my moving note positions.
const chords = range(12 * 3).map((i) =>
	startChord.map((note) => inc(scale, note, i))
)

function Row(props: { chord?: m.Scale }) {
	const chord = props.chord || []
	return (
		<div
			style={{ display: "flex" }}
			onMouseEnter={() => {
				chord.map((note) => {
					hit(note + 12 * 4)
				})
			}}
		>
			{range(3).map((octave) =>
				m.diatonic.map((note) => {
					const color = (alt: string) =>
						chord.includes(note)
							? ["#77f", "#99f", "#aaf"][chord.indexOf(note)]
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
		<div style={{ paddingTop: 80, paddingLeft: 40 }} onMouseDown={startTone}>
			<Row />
			{chords.map((chord) => (
				<Row chord={chord} />
			))}
		</div>
	)
}
