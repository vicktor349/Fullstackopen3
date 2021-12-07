const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())

//MIDDLEWARE
const requestLogger = (request,response,next) =>{
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger)

const unknownEndpoint = (request,response,next) =>{
    response.status(404).send({ error : "unknown endpoint"})
    next()
}

app.use(unknownEndpoint)

// NOTE LIST
let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2020-01-10T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2020-01-10T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2020-01-10T19:20:14.298Z",
      important: true
    }
  ]

// SENDING A GET REQUEST FOR HOMEPAGE
app.get('/',(req,res) =>{
    res.send('<h1>Hello world</h1>')
})

// SENDING A GET REQUEST FOR ALL THE NOTES
app.get('/api/notes', (req,res) =>{
    res.json(notes)
})

// SENDING A GET REQUST FOR INDIVIDUAL NOTE
app.get('/api/notes/:id',(req,res) =>{
    const id = Number(req.params.id)
    const note = notes.find(note => note.id === id)
    if(note){
        res.json(note)
    }else{
        res.status(404).end()
    }

})
// DELETE REQUEST FOR SINGLE RESOURCE
app.delete('/api/notes/:id',(req,res) =>{
    const id = Number(req.params.id)
    notes = notes.filter(note => note.id !== id)
    res.status(204).end()
    console.log(`${id} was deleted successfully...`)
})

// POST REQUEST

const generateId = () =>{
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    :0
    return maxId + 1
}

app.post('/api/notes',(req,res) =>{
   const body = req.body
    if(!body.content){
        return res.status(400).end({
            error: 'Content Missing'
        })
    }
    const note = {
        id: generateId(),
        content: body.content,
        date: new Date(),
        important: body.important || false        
    }
    notes = notes.concat(note)
    res.json(note)
})



const PORT = 3001
app.listen(PORT)
console.log(`Server is running on PORT ${PORT}`)