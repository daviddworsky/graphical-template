import express from 'express'
import { workflow } from './workflow'

const app = express()
const port = 3001

// Middleware to parse JSON bodies
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'workflow-server',
  })
})

// Execute the entire workflow
app.post('/api/workflow/execute', async (req, res) => {
  try {
    const { input } = req.body

    // Execute the workflow
    const result = await workflow.execute(input || {})

    res.json({
      success: true,
      workflowId: workflow.id,
      workflowName: workflow.name,
      result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      workflowId: workflow.id,
    })
  }
})

// Execute a specific node/step by ID
app.post('/api/workflow/node/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params
    const { input } = req.body

    // Get node info first to validate it exists
    const nodeInfo = workflow.getNodeInfo(nodeId)
    if (!nodeInfo) {
      return res.status(404).json({
        success: false,
        error: `Node with ID '${nodeId}' not found`,
        availableNodes: workflow.getInvokableNodeIds(),
      })
    }

    // Execute the specific node
    const result = await workflow.invoke(nodeId, input || {})

    res.json({
      success: true,
      nodeId,
      nodeInfo,
      workflowId: workflow.id,
      result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      nodeId: req.params.nodeId,
    })
  }
})

// Get workflow structure and available nodes
app.get('/api/workflow/info', (req, res) => {
  try {
    const structure = workflow.getStructure()

    res.json({
      success: true,
      workflow: {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        structure,
        invokableNodes: workflow.getInvokableNodeIds().map((nodeId) => ({
          id: nodeId,
          ...workflow.getNodeInfo(nodeId),
        })),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app
