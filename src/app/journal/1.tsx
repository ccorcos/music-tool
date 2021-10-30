import { range } from "lodash"
import React from "react"
import { SquaresRotate, SquaresRow } from "../components/Squares"
import * as m from "../helpers/music"
import { toggleTone } from "../helpers/sound"

export function JournalOne() {
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
		<SquaresRotate
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
				<SquaresRow scale={scale} chord={[]} repeat={true} normalize={false} />
				<p>
					Let's play the following interval: "{m.scaleToString(startChord)}"
				</p>
				<SquaresRow
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
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={false}
						/>
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
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={true}
						/>
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
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={true}
						/>
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
