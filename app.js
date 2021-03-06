const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const port = process.env.PORT || 3000
const app = express()

let CONTACTS = [
  {id: v4(), name: 'Nick', value: '+7-921-100-20-30', marked: false}
]

// PostgreSQL
const {Pool} = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://igtztsmtrhqyab:e477a518041083697c806ded9bdf2347103681fce46225df53c1e295ad5cd60c@ec2-44-196-8-220.compute-1.amazonaws.com:5432/d6svbua0ihar04',
  ssl: {
    rejectUnauthorized: false
  }
})

//
app.use(express.json())

// GET
app.get('/v1/coin/:uuid', async (req, res) => {
  try {
    const uuid = req.params.uuid
    const client = await pool.connect()
    const result = await client.query('SELECT id, coin_name, uuid_coinranking, coin_symbol FROM coins WHERE uuid_coinranking = $1', [uuid], (error, results) => {
      if (error) {
        throw error
      }
      res.status(200).json(results.rows)
    })
    client.release()
  } catch (err) {
    console.error(err)
    res.send("Error " + err)
  }
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
//app.use(express.static(path.resolve(__dirname, 'client')))

// All GET
app.get('*', (req, res) => {
  //res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
  res.json({ info: 'Hi!' })
})

// Start
async function start() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (e) {
    console.log('Server error', e.message)
    process.exit(1)
  }
}

// GO!
start()

