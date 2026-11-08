# Guitar samples for Jimmy Page

Real recorded guitar notes, one file per note, in MP3.

- acoustic/ : steel-string acoustic guitar, every half step from D2 to D5 (37 notes). Source: University of Iowa Musical Instrument Samples (via tonejs-instruments).
- electric/ : clean electric guitar, 17 notes spread across the range (the player fills the gaps by pitch-shifting the nearest sample). Source: Karoryfer Samples (via tonejs-instruments).

File names: "Cs4" means C sharp 4, "As3" means A sharp 3. Middle C is C4.

## License (please keep this file in the project)
Samples come from the tonejs-instruments collection by Nicholaus P. Brosowsky
(https://github.com/nbrosowsky/tonejs-instruments), released under CC BY 3.0
(https://creativecommons.org/licenses/by/3.0/). Code in that project is MIT (see LICENSE.md).
Original sources are listed in sample-source-info.txt.

Attribution line to show in the app (e.g. in an About or Credits section):
"Guitar samples: tonejs-instruments by Nicholaus Brosowsky (CC BY 3.0), from the University of Iowa Musical Instrument Samples and Karoryfer Samples."

## How to use
- Put this folder in public/samples/ so the files are served as static assets.
- Load them with a sampler (for example Tone.js Sampler) mapping note names to file URLs.
- Chords: play the chord's notes from low string to high string with 10 to 25 ms between strings, so it sounds strummed instead of all at once.
