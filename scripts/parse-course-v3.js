import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const md = readFileSync(join(root, 'COURSE_V3.md'), 'utf8')

const STRING_NUM = { E: 6, A: 5, D: 4, G: 3, B: 2, e: 1 }
const POS_RE = /([EADGBe]):(\d{1,2})\s*\(([^)]+)\)/g

function parsePositions(text) {
  const list = []
  if (!text) return list
  POS_RE.lastIndex = 0
  let match
  while ((match = POS_RE.exec(text))) {
    list.push({
      stringLetter: match[1],
      string: STRING_NUM[match[1]],
      fret: Number(match[2]),
      name: match[3].trim(),
    })
  }
  return list
}

function stripFence(block) {
  return block.replace(/```[\s\S]*?```/g, '').trim()
}

function parseChips(line) {
  const chips = []
  if (/Fact/i.test(line)) chips.push('Fact')
  if (/Common guideline/i.test(line)) chips.push('Common guideline')
  return chips
}

function parseListen(text) {
  const strummed = [...text.matchAll(/([A-G][b♭#♯m]*)(?:\s+strummed)?/g)]
    .map((item) => item[1])
    .filter((name) => /^(C|G|D|Dm|A|Am|E|Em|F|Bm)$/.test(name))
  if (/click at 80|beat 1 louder/i.test(text)) {
    return { kind: 'clicks', bpm: 80, bars: 2, accent: true }
  }
  if (/backing/i.test(text)) return { kind: 'backing', bpm: 80, glow: /glow/i.test(text) }
  if (/both together/i.test(text)) return { kind: 'together', positions: parsePositions(text) }
  if (/strums on the "ands"|strums on the numbers/i.test(text)) {
    return { kind: 'syncopation-demo', bpm: 80 }
  }
  if (/whole note|half notes|quarter notes|eighth notes/i.test(text)) {
    return { kind: 'note-lengths', position: parsePositions(text)[0] || { string: 4, fret: 7, name: 'A' } }
  }
  const positions = parsePositions(text)
  if (text.includes('strummed') && strummed.length) {
    return { kind: 'strum', chords: [...new Set(text.split(/,| then |, then /).flatMap((part) => {
      const found = part.match(/\b(C|G|D|Dm|A|Am|E|Em|F|Bm)\b/g)
      return found || []
    }))] }
  }
  if (positions.length) return { kind: 'notes', positions }
  if (strummed.length) return { kind: 'strum', chords: strummed }
  return { kind: 'listen', text }
}

function parsePlay(text) {
  const positions = parsePositions(text)
  const anyOrder = /any order/i.test(text)
  return { kind: 'play', positions, mode: anyOrder ? 'set' : 'sequence', showNames: true }
}

function parseFind(text) {
  const positions = parsePositions(text)
  const accept = text.match(/accept note ([A-G][♯♭b#]?)/i)
  if (/whole step apart on the D string/i.test(text)) {
    return { kind: 'find', pass: { type: 'interval', string: 4, frets: 2 }, prompt: text.split('→')[0].replace(/^-\s*Find:\s*/i, '').trim() }
  }
  if (/half step apart on the G string/i.test(text)) {
    return { kind: 'find', pass: { type: 'interval', string: 3, frets: 1 }, prompt: text.split('→')[0].replace(/^-\s*Find:\s*/i, '').trim() }
  }
  if (/last note of each bar is a chord note/i.test(text)) {
    return { kind: 'improv', pass: { type: 'loop-end-chord' }, prompt: text.replace(/^-\s*/, '').trim() }
  }
  if (/end on A/i.test(text) && /bar 4/i.test(text)) {
    return { kind: 'improv', pass: { type: 'bar4-end-A' }, prompt: text.replace(/^-\s*/, '').trim() }
  }
  if (/two bars share the same idea/i.test(text)) {
    return { kind: 'improv', pass: { type: 'builder' }, prompt: text.replace(/^-\s*/, '').trim() }
  }
  if (/rest inside a bar and one note starting off/i.test(text)) {
    return { kind: 'improv', pass: { type: 'rhythm-space' }, prompt: text.replace(/^-\s*/, '').trim() }
  }
  if (/E♭ is followed|using E♭ once/i.test(text)) {
    return { kind: 'improv', pass: { type: 'blue-once' }, prompt: text.replace(/^-\s*/, '').trim() }
  }
  if (accept) {
    return {
      kind: 'find',
      prompt: text.split('→')[0].replace(/^-\s*Find:\s*/i, '').trim(),
      pass: { type: 'note', name: accept[1].replace('b', '♭') },
      positions,
    }
  }
  return {
    kind: 'find',
    prompt: text.split('→')[0].replace(/^-\s*(Find|Play):\s*/i, '').trim(),
    positions,
    mode: /any order/i.test(text) ? 'set' : positions.length > 1 ? 'sequence' : 'any',
    showNames: false,
  }
}

function parseRhythm(text) {
  const pos = parsePositions(text)[0]
  const taps = Number((text.match(/(\d+)\s+taps/) || [])[1] || 0)
  const bpm = Number((text.match(/(\d+)\s*bpm/i) || [])[1] || 80)
  const tolerance = Number((text.match(/within (\d+)\s*ms/) || [])[1] || 150)
  let pattern = 'beat'
  let beats = taps
  if (/beats 1 and 3/i.test(text)) pattern = 'half'
  if (/halfway between|ands/i.test(text)) pattern = 'offbeat'
  return { kind: 'rhythm', position: pos, taps, bpm, pattern, beats, toleranceMs: tolerance, prompt: text.replace(/^-\s*Rhythm:\s*/i, '').trim() }
}

function parseActions(block) {
  const actions = []
  const lines = block.split('\n')
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (/^-\s*Play:/i.test(trimmed) || /^\s*Play:/i.test(trimmed)) {
      actions.push(parsePlay(trimmed.replace(/^-\s*/, '')))
    } else if (/^-\s*Listen:/i.test(trimmed) || /^\s*Listen:/i.test(trimmed)) {
      actions.push(parseListen(trimmed.replace(/^-\s*/, '')))
    } else if (/^-\s*Find:/i.test(trimmed)) {
      let text = trimmed
      if (lines[i + 1] && /^\s{2}/.test(lines[i + 1]) && /Then (show|ask)/i.test(lines[i + 1])) {
        text += ` ${lines[i + 1].trim()}`
        i += 1
      }
      actions.push(parseFind(text))
    } else if (/^-\s*Rhythm:/i.test(trimmed)) {
      actions.push(parseRhythm(trimmed))
    } else if (/^-\s*Play along|^-\s*Build four|^-\s*Play one loop|^-\s*Play bar 4/i.test(trimmed)) {
      actions.push(parseFind(trimmed))
    }
    i += 1
  }
  return actions
}

function proseOf(block) {
  return stripFence(block)
    .split('\n')
    .filter((line) => {
      const t = line.trim()
      if (!t) return false
      if (/^-\s*(Play|Listen|Find|Rhythm):/i.test(t)) return false
      if (/^\s*(Play|Listen):/i.test(t)) return false
      if (t.startsWith('|')) return true
      return !t.startsWith('- Play along') && !t.startsWith('- Build') && !t.startsWith('- Play one') && !t.startsWith('- Play bar')
    })
    .join('\n')
    .trim()
}

function parseQuiz(section) {
  const questions = []
  const chunks = section.split(/^Q\d+\s+/m).slice(1)
  for (const chunk of chunks) {
    const head = chunk.trim()
    const kindMatch = head.match(/^\((choose|play)\)\s*/)
    const kind = kindMatch ? kindMatch[1] : 'choose'
    const rest = head.replace(/^\((choose|play)\)\s*/, '')
    const firstLine = rest.split('\n')[0].trim()
    const prompt = firstLine.replace(/\s*→.*$/, '').trim()
    const answerPositions = parsePositions(rest.split('\n')[0] + ' ' + rest)
    const options = []
    const fixes = []
    for (const line of rest.split('\n')) {
      const t = line.trim()
      if (!t.startsWith('-')) continue
      const body = t.slice(1).trim()
      if (/^If\s+/i.test(body) || /^Wrong/i.test(body)) {
        const fix = (body.split('→ fix:')[1] || '').trim()
        const ifPos = parsePositions(body)
        fixes.push({ when: /^Wrong/i.test(body) ? 'any' : ifPos[0] || 'any', fix })
        continue
      }
      const correct = /✓/.test(body)
      const [labelPart, fixPart] = body.split('→ fix:')
      const label = labelPart.replace('✓', '').trim()
      options.push({ text: label, correct })
      if (fixPart) fixes.push({ when: label, fix: fixPart.trim() })
    }
    const accept = rest.match(/accept note ([A-G][♯♭b#]?(?: or [A-G][♯♭b#]?)*)/i)
    questions.push({
      kind,
      prompt,
      options: kind === 'choose' ? options : [],
      positions: kind === 'play' ? answerPositions : [],
      mode: /any order/i.test(rest) ? 'set' : answerPositions.length > 1 ? 'sequence' : 'any',
      acceptNotes: accept
        ? accept[1].split(/ or /i).map((n) => n.replace('b', '♭').trim())
        : [],
      fixes,
    })
  }
  return questions
}

function splitNumbered(section) {
  const steps = []
  const re = /^(\d+)\.\s+/gm
  const matches = [...section.matchAll(re)]
  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : section.length
    const raw = section.slice(start, end).replace(/^\d+\.\s+/, '').trim()
    steps.push({
      text: proseOf(raw),
      actions: parseActions(raw),
    })
  }
  return steps
}

function bullets(section) {
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => {
      const raw = line.slice(2).trim()
      return { text: proseOf(raw), actions: parseActions(`- ${raw}`), raw }
    })
}

const who = (md.match(/\*\*Who it's for:\*\*\s*(.+)/) || [])[1]?.trim() || ''
const goal = (md.match(/\*\*Course goal:\*\*\s*(.+)/) || [])[1]?.trim() || ''

const voicingRows = [...md.matchAll(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .slice(1)
  .filter((row) => !row[1].includes('---') && !row[1].includes('Chord'))
  .map((row) => ({
    chord: row[1].replace(/\s*\(.*\)/, '').trim(),
    shape: row[2].trim(),
    positions: parsePositions(row[3]),
  }))

const moduleParts = md.split(/^# Module /m).slice(1)
const modules = []

for (const part of moduleParts) {
  const headerLine = part.split('\n')[0]
  const number = Number((headerLine.match(/^(\d+)/) || [])[1])
  const title = headerLine.replace(/^\d+:\s*/, '').replace(/\s*\(.*\)\s*$/, '').trim()
  const intro = ((part.match(/\*\*Intro line:\*\*\s*"([^"]+)"/) || [])[1] || '').trim()

  if (number === 10) {
    const items = part
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- ') && !line.includes('JustinGuitar') && !line.includes('SongNotes') && !line.includes('Open Music'))
      .map((line) => line.slice(2).trim())
    modules.push({ id: 'm10', number: 10, title, kind: 'roadmap', items })
    continue
  }

  const glow = {}
  if (number === 9) {
    const table = part.match(/\| Chord \| Glowing positions \|[\s\S]*?\n\n/)
    if (table) {
      for (const row of table[0].split('\n').slice(2)) {
        const cols = row.split('|').map((c) => c.trim()).filter(Boolean)
        if (cols.length < 2) continue
        const name = cols[0].split(' ')[0]
        glow[name] = parsePositions(cols[1])
      }
    }
  }

  const lessons = []
  const lessonParts = part.split(/^## /m).slice(1)
  for (const lessonPart of lessonParts) {
    const first = lessonPart.split('\n')[0].trim()
    const idMatch = first.match(/^(\d+\.\d+)\s+(.+)/)
    if (!idMatch) continue
    const id = idMatch[1]
    const name = idMatch[2].trim()
    const chipLine = (lessonPart.match(/^Chip:.*$/m) || [])[0] || ''
    const why = ((lessonPart.match(/\*\*Why it matters:\*\*\s*(.+)/) || [])[1] || '').trim()
    const remember = ((lessonPart.match(/\*\*Remember:\*\*\s*(.+)/) || [])[1] || '').trim()

    const teachBlock = (lessonPart.split(/### Teach/)[1] || '').split(/### /)[0] || ''
    const examplesBlock = (lessonPart.split(/### Examples/)[1] || '').split(/### /)[0] || ''
    const practiceBlock = (lessonPart.split(/### Practice/)[1] || '').split(/### /)[0] || ''
    const quizBlock = (lessonPart.split(/### Quiz/)[1] || '').split(/\*\*Remember:/)[0] || ''

    const special = /^9\.6/.test(id)
      ? {
          kind: 'challenge',
          goals: [
            'Every bar ends on a chord note for that bar.',
            'Bar 4 ends on A.',
            'At least two bars share the same idea.',
            'At least one rest inside a bar.',
            'At most one scale run (three or more notes stepping through the box in one direction).',
          ],
        }
      : null

    lessons.push({
      id,
      name,
      chips: parseChips(chipLine),
      why,
      teach: splitNumbered(teachBlock),
      examples: bullets(examplesBlock).length ? bullets(examplesBlock) : splitNumbered(examplesBlock),
      practice: bullets(practiceBlock),
      quiz: parseQuiz(quizBlock),
      remember,
      special,
    })
  }

  modules.push({
    id: `m${number}`,
    number,
    title,
    kind: number === 9 ? 'improv' : 'lessons',
    intro,
    glow,
    backing: number === 9 ? { chords: ['Am', 'F', 'G', 'Am'], bpm: 80 } : null,
    lessons,
  })
}

const course = {
  title: 'Guitar Theory You Can Play',
  who,
  goal,
  voicings: voicingRows,
  modules,
}

const outDir = join(root, 'src/course')
mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'lessons.json'), `${JSON.stringify(course, null, 2)}\n`)
console.log(
  `parsed ${modules.length} modules, ${modules.reduce((n, mod) => n + (mod.lessons?.length || 0), 0)} lessons`,
)
