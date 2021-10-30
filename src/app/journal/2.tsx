import { range } from "lodash"
import React from "react"
import { SquaresRotate, SquaresRow } from "../components/Squares"
import * as m from "../helpers/music"
import { toggleTone } from "../helpers/sound"

export function JournalTwo() {
	// Should we repeat notes in every octave?
	const REPEAT = false
	const NORMALIZE = true

	// Pentatonic scale
	const scale = [m.root, m.minorThird, m.fourth, m.fifth, m.minorSeven]
	const startChord = [m.root, m.fifth]
	// // const startChord = [m.root, m.fourth, m.minorSeven]
	// const startChord = [m.root, m.fifth, m.minorSeven]

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
				<p>This is the pentatonic scale. "{m.scaleToString(scale)}"</p>
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
					You'll notice that every chord is the exact same interval except for
					one which is a half step larger.
				</p>

				<p>
					Lets try a fourth instead of a fifth: "
					{m.scaleToString([m.root, m.fourth])}"
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fourth], i))
					.map((chord) => (
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={true}
						/>
					))}
				<p>Pretty similar, as expected.</p>
				<p>
					Something more interesting is when we introduce another note though.
					Lets try "{m.scaleToString([m.root, m.fifth, m.minorSeven])}"
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fifth, m.minorSeven], i))
					.map((chord) => (
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={true}
						/>
					))}
				<p>
					Whoa. I think that visual really gives you a sense for how each chord
					just bathes you in a very similar set of intervals that climbs the
					scale subtly.
				</p>

				<p>
					Lets try 1-4-7. "{m.scaleToString([m.root, m.fourth, m.minorSeven])}"
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fourth, m.minorSeven], i))
					.map((chord) => (
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={false}
							normalize={true}
						/>
					))}
				<p>A little more spread out, but it sounds very similar...</p>
				<p>
					It's interesting, though I'm not sure its useful, to view these
					different chords without normalizing to the first note and repeating
					all notes at every octave: "
					{m.scaleToString([m.root, m.fifth, m.minorSeven])}"
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fifth, m.minorSeven], i))
					.map((chord) => (
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={true}
							normalize={false}
						/>
					))}

				<p>
					That looks notably different from:
					{m.scaleToString([m.root, m.fourth, m.minorSeven])}"
				</p>
				{range(scale.length * 3, scale.length * 7)
					.map((i) => m.rotateChord(scale, [m.root, m.fourth, m.minorSeven], i))
					.map((chord) => (
						<SquaresRow
							scale={scale}
							chord={chord}
							repeat={true}
							normalize={false}
						/>
					))}

				<p>
					And you can actually kind of hear it. The first one the fifth and
					third intervals in there that line up very strongly whereas the fourth
					line up a little more spread out for a softer and in someways less
					resonant sound.
				</p>

				{/* {variant(startChord)} */}
				{/* {variant([m.root, m.fourth])} */}
				{/* {variant([m.root, m.fifth])} */}
				{/* {variant([m.root, m.minorSeven])} */}
			</div>
		</div>
	)
}
