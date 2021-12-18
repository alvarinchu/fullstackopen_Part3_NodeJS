const express = require('express')
const app = express()
app.use(express.json())

const port = 3000

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2019-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: true
    }
  ]

app.get('/', (req, res) => res.send('<h1>Hola Mundo!</h1>'))

app.get("/api/notes", (req,res) => {
    res.json(notes)
})

app.get("/api/notes/:id", (req,res) => {
    const noteId = Number(req.params.id)
    const note = notes.find(m =>  m.id === noteId)

    if (note) {
        res.json(note)
    }
    else
    {
        res.sendStatus(404)
    }
})

app.delete("/api/notes/:id", (req, res) => {
    const noteId = Number(req.params.id)
    const note = notes.find(m =>  m.id === noteId)

    if (note) {
        notes = notes.filter(m=> m.id !== noteId)
        res.sendStatus(204)
    }
    else
    {
        res.sendStatus(404)
    }
})

app.post("/api/notes", (req,res) => {
    
    if (!req.body.content) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      }

    const noteInfo = req.body

    const newNote = {
        id: generateId(),
        content: noteInfo.content,
        important: noteInfo.important,
        date: new Date()
    }

    notes = notes.concat(newNote)

    res.json(newNote)

})

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    return maxId + 1
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))