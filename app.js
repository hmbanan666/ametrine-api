const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

let CONTACTS = [
  {id: v4(), name: 'Nick', value: '+7-921-100-20-30', marked: false}
]

app.use(express.json())

// GET
app.get('/api/contacts', (req, res) => {
  res.status(200).json(CONTACTS)
})

// POST
app.post('/api/contacts', (req, res) => {
  const contact = {...req.body, id: v4(), marked: false}
  CONTACTS.push(contact)
  res.status(201).json(contact)
})

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
  res.status(200).json({message: 'Contact was deleted'})
})

// PUT
app.put('/api/contacts/:id', (req, res) => {
  const idx = CONTACTS.findIndex(c => c.id === req.params.id)
  CONTACTS[idx] = req.body
  res.status(200).json(CONTACTS[idx])
})


/////////////////////////////////////////////////////////
// Show client
app.use(express.static(path.resolve(__dirname, 'client')))

// All GET
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

// Port
const PORT = process.env.PORT || 3000

// Start
async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

// GO!
start()

