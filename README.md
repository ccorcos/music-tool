# Music Tool

A tool for music.

## Getting Started

```sh
npm install
npm start
```

## Todo

This thing with squares was fun. And it made me realize a few things.

1. diatonic -> scale :: scale -> chord
2. all the music helper functions can leverage this fact to be more reusable.

As a primitive in this app, we will have scales, and then selections within those scales.

Generally speaking in the UI:

1. A scale is default REPEAT: true. A chord is default REPEAT: false.
2. A scale is default NORMALIZE: true. A chord is default NORMALIZE: false.

So what's next:

- [ ] refactor music helper functions and write tests.
- [ ] use the triplestore for working with the state of this app.
- [ ] make a "squares" block for the music tool.


---



TODO: guitar midinote selection

- [ ] show note name / midinote label on hover
- [ ] better onUpdate to accept an updater function.
- [ ] onActive state
- [ ] use chroma.js for color mixing

- [ ] undo-redo

- [ ] useGesture package?
- [ ] useSpring package?


- [ ] different types of music blocks
  - paint notes in different colors.
    - show/hide certain groups
    - more than one group per note. mix colors together?
  - guitar
    - in all positions
    - in all octaves
  - piano
    - in all octaves

  - later
    - chord prediction
    - wire modules together

  - [ ] Spiral
  - [ ] Circle
  - [ ] Tab view
  - [ ] Metronome
  - [ ] Audio file
  - [ ] Text-based note


