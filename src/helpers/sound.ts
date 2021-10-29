import * as Tone from "tone"

let synth: Tone.Synth | undefined
export function startTone() {
	synth = new Tone.Synth().toDestination()
}

export function hit(note: number) {
	if (!synth) return
	//play a middle 'C' for the duration of an 8th note
	synth.triggerAttackRelease(Tone.Midi(note).toFrequency(), "8n")
}
