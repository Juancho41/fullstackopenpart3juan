const { request, response } = require('express')
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

morgan.token('postcontent', function getPost(request) {
    const prueba = request.body
    delete prueba.id
    return `${JSON.stringify(prueba)}`
})

const app = express()

app.use(express.static('build'))
app.use(cors())

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postcontent'))

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {

    response.send('Phonebook has info for ' + phonebook.length + ' people ' + '<br/>' + Date())

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    response.status(204).end()

})

app.post('/api/persons', (request, response) => {

    const name = request.body.name
    if (!name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!request.body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (phonebook.find(person => person.name === name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = request.body
    person.id = Math.random() * 1000

    phonebook = phonebook.concat(person)

    response.json(person)

})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})