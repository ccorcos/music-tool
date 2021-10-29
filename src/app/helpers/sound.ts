import * as Tone from "tone"

let synth: Tone.PolySynth | undefined
export function startTone() {
	synth = new Tone.PolySynth().toDestination()
}
export function stopTone() {
	synth = undefined
}
export function toggleTone() {
	if (synth) stopTone()
	else startTone()
}

export function hit(note: number) {
	if (!synth) return
	//play a middle 'C' for the duration of an 8th note
	synth.triggerAttackRelease(Tone.Midi(note).toFrequency(), "8n")
}
