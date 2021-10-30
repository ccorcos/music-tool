import { range } from "lodash"
import React from "react"
import { mixColor } from "../helpers/color"
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

	// Pentatonic scale
	// const scale = [m.root, m.minorThird, m.fourth, m.fifth, m.minorSeven]
	// // const startChord = [m.root, m.fifth]
	// // const startChord = [m.root, m.fourth, m.minorSeven]
	// const startChord = [m.root, m.fifth, m.minorSeven]

	// maj7+2
	const scale = [m.root, m.second, m.majorThird, m.fifth, m.majorSeven]
	const startChord = [m.root, m.majorThird]

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
				<p>Check out this scale. "{m.scaleToString(scale)}"</p>
				<Row scale={scale} chord={[]} repeat={true} normalize={false} />
				<p>
					Let's play the following interval: "{m.scaleToString(startChord)}"
				</p>
				<Row
					scale={scale}
					chord={startChord}
					repeat={false}
					normalize={false}
				/>
				<p>
					And work our way up the scale.
					<br />
					(Click below and hover over each row to sound a each chord.)
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, startChord, i))
					.map((chord) => (
						<Row scale={scale} chord={chord} repeat={false} normalize={false} />
					))}
				<p>
					You'll notice that the distance between the two notes changes between
					each row. All we're doing is moving each note ahead one position in
					the scale.
				</p>
				<p>
					One way to visualize this is to normalize each chord by its first
					note. Basically, slide everything over so they line up.
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, startChord, i))
					.map((chord) => (
						<Row scale={scale} chord={chord} repeat={false} normalize={true} />
					))}
				<p>
					So this is the same thing as before, just normalized by the lower note
					in each two-note chord. Pretty neat... It's hard for me to perceive
					the different intervals. It's just a very resonant way of moving up
					and down the scale.
				</p>
				<p>Lets try another chord: "{m.scaleToString([m.root, m.fifth])}"</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fifth], i))
					.map((chord) => (
						<Row scale={scale} chord={chord} repeat={false} normalize={true} />
					))}
				<p>
					This is a pretty fun scale. And I think what's so nice about it is
					that the intervals shift so much as you move chords around it.
				</p>

				{/* {variant(startChord)} */}
				{/* {variant([m.root, m.fourth])} */}
				{/* {variant([m.root, m.fifth])} */}
				{/* {variant([m.root, m.minorSeven])} */}
			</div>
		</div>
	)
}
