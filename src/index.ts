import express from 'express'

const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello Express with TypeScript!')
})

app.get('/api/greeting/:name', (req, res) => {
  const name = req.params.name
  res.send(`Hello, ${name}!`)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app
