import { COURSE_FOR, COURSE_GOAL, MODULE_1 } from './module1.js'
import { MODULE_2 } from './module2.js'
import { MODULE_3 } from './module3.js'
import { MODULE_4 } from './module4.js'
import { MODULE_5 } from './module5.js'
import { MODULE_6 } from './module6.js'
import { MODULE_7 } from './module7.js'
import { MODULE_8 } from './module8.js'
import { MODULE_9 } from './module9.js'
import { MODULE_10 } from './module10.js'

export { COURSE_FOR, COURSE_GOAL }

export const MODULES = [
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
  MODULE_9,
  MODULE_10,
]

export function liveModules() {
  return MODULES.filter((item) => item.status === 'full' && item.concepts)
}

export function allConcepts() {
  return liveModules().flatMap((mod) =>
    mod.concepts.map((concept) => ({ ...concept, moduleId: mod.id, moduleNumber: mod.number })),
  )
}

export function conceptById(id) {
  return allConcepts().find((item) => item.id === id)
}

export function nextConcept(id) {
  const list = allConcepts()
  const index = list.findIndex((item) => item.id === id)
  return list[index + 1] || null
}
