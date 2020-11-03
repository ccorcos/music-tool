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
- [ ] undo-redo

- [ ] different types of music blocks
  - [ ] Piano
   - [ ] Chord Name
   - [ ] Octave labels
   - [ ] Save scroll offset + initial offset
   - [ ] Click notes
   - [ ] Shadow notes
   - [ ] Chord prediction
   - [ ] block type drop-down
  - [ ] Guitar
  - [ ] Spiral
  - [ ] Circle
  - [ ] Metronome
  - [ ] Audio file
  - [ ] Text-based note

