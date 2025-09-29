import { createStep } from 'runpoint-ai'

export const step1 = createStep({
  id: 'step1',
  execute: (input: number) => input + 1,
})
