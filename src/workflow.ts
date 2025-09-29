import { createWorkflow } from 'runpoint-ai'
import { step1 } from './steps/step1'

export const workflow = createWorkflow({
  id: 'workflow-name',
})
  .then(step1)
  .commit()
