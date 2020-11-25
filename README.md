# Music Tool

A tool for music.

## Getting Started

```sh
npm install
npm start
```

## Deploy

An in order to be able to deploy this using Github pages, you'll need to create an push an initial branch to Github:

```sh
git checkout -b gh-pages
git push origin gh-pages
git checkout master
```

## Todo

- [x] JSON state, persist to localStorage
- [x] save scroll position
- [x] draggable blocks
- [x] toolbar (reset state, new block)
- [x] resizable blocks
- [x] faster rebuild speed?

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


