const express = require('express')
const app = express()
app.use(express.json())

// 3.7 Add morgan for logging
var morgan = require('morgan')

// 3.8 Add custom token to log POST request body
morgan.token('postbody', function (req, res) {
  if (req.method === "POST") {
    return " " + JSON.stringify(req.body)
  } else {
    return " "
  }
})
// Use custom format instead of 'tiny' for exercise 3.8
// app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms:postbody'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

// For simplicity, the function does NOT check if the id is in use, but the value range is huuuge
const generatePersonId = () => {
  var id = Math.floor(Math.random() * (10e10 - 10e9) + 10e9) // Generate id between 10e9 and 10e10-1 (or something very close to that :) )
  return id
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// 3.2 Info page. Ugly but works :)
app.get('/info/', (req, res) => {
  var number_of_people = String(persons.length)
  var info_line = `<p>Phonebook has info for ${number_of_people} people<p>`
  var date = new Date()
  var timestamp_line = `<p>${date}<p>`
  res.send(`<div>${info_line}${timestamp_line}</div>`)
})

// 3.1 Get all person resources
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.3 Get a single person resource
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id) // 
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// 3.4 Delete resource
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  // Could also return 404 if no resources were deleted
  res.status(204).end()
})

// 3.5 Post resource and 3.6 check for user input
app.post('/api/persons/', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'name or number is missing' 
    })
  } else if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  var person = {
    id: generatePersonId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
