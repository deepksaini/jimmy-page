export const PITCH_CLASS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
export const PITCH_CLASS_ASCII = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/** 1 = high e … 6 = low E */
export const OPEN_MIDI = [0, 64, 59, 55, 50, 45, 40]
export const STRING_NAMES = ['', 'E', 'B', 'G', 'D', 'A', 'E']
export const COURSE_STRINGS = [6, 5, 4, 3, 2, 1]
export const COURSE_FRETS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
export const STRUM_GAP = 0.018

export function midiOf(string, fret) {
  return OPEN_MIDI[string] + fret
}

export function pcOf(midi) {
  return ((midi % 12) + 12) % 12
}

export function noteName(midi) {
  return PITCH_CLASS[pcOf(midi)]
}

export function noteAscii(midi) {
  return PITCH_CLASS_ASCII[pcOf(midi)]
}

export function noteWithOctave(midi) {
  const oct = Math.floor(midi / 12) - 1
  return `${noteAscii(midi)}${oct}`
}

export function prettyNote(midi) {
  const oct = Math.floor(midi / 12) - 1
  return `${noteName(midi)}${oct}`
}

export function scaleDegree(midi, rootPc = 0) {
  const rel = (pcOf(midi) - rootPc + 12) % 12
  return ['1', '♭2', '2', '♭3', '3', '4', '♭5', '5', '♭6', '6', '♭7', '7'][rel]
}

export const ACOUSTIC_FILES = [
  'A2',
  'A3',
  'A4',
  'As2',
  'As3',
  'As4',
  'B2',
  'B3',
  'B4',
  'C3',
  'C4',
  'C5',
  'Cs3',
  'Cs4',
  'Cs5',
  'D2',
  'D3',
  'D4',
  'D5',
  'Ds2',
  'Ds3',
  'Ds4',
  'E2',
  'E3',
  'E4',
  'F2',
  'F3',
  'F4',
  'Fs2',
  'Fs3',
  'Fs4',
  'G2',
  'G3',
  'G4',
  'Gs2',
  'Gs3',
  'Gs4',
]

export function sampleFileToToneName(file) {
  return file.replace(/^([A-G])s/, '$1#')
}

export function acousticUrls() {
  const urls = {}
  for (const file of ACOUSTIC_FILES) {
    urls[sampleFileToToneName(file)] = `${file}.mp3`
  }
  return urls
}

export const SAMPLE_CREDIT =
  'Guitar samples: tonejs-instruments by Nicholaus Brosowsky (CC BY 3.0), from the University of Iowa Musical Instrument Samples and Karoryfer Samples.'
