const express = require("express");
const { json } = require("express/lib/response");
const app = express();
const morgan = require("morgan");

app.use(express.json())
//app.use(morgan('tiny'));

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      req.method == "POST" ? JSON.stringify(req.body) : ""
    ].join(' ')
  }))


let agenda = [
    {
        id: 1,
        name: "Alvaro",
        number: "34343434343"
    },
    {
        id: 2,
        name: "Clara",
        number: "54354545454"
    },
    {
        id: 3,
        name: "Alvaro Jr.",
        number: "09090909090"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(agenda);
});

app.get("/api/persons/:id", (req, res) => {
    const personId = Number(req.params.id);

    const person = agenda.find(m => m.id === personId);

    if (person) {
        res.json(person);
    }
    else {
        res.sendStatus(404);
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const personId = Number(req.params.id);
    const person = agenda.find(m => m.id === personId);

    if (person) {
        agenda = agenda.filter(m => m.id != personId);
        res.sendStatus(202);
    }
    else {
        res.sendStatus(404);
    }

});

app.post("/api/persons", (req, res) => {

    if (!req.body) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    if (!req.body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    if (!req.body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    if (agenda.find(m => m.name === req.body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: getRandomArbitrary(100, 10000),
        name: req.body.name,
        number: req.body.number,
    }

    agenda.push(person)

    res.json(person)

});

app.get("/api/info", (req, res) => {
    res.send(`Phonebook has info of ${agenda.length} people<br/><br/>${new Date()}`);
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const getRandomArbitrary = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const PORT = 3001

app.listen(PORT, () => console.log(`API Agenda Telefónica - escuchando en puerto ${PORT}`));
