const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
app.use(cors())
const port = process.env.PORT || 3000;

const MongoClient = require("mongodb").MongoClient;

const url = "mongodb+srv://memory-game:ePWMNoNJtnrvZ4dv@cluster0.bsofz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const mongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;

mongoClient.connect((err, client) => {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("memory-game-score").collection("score");
    app.listen(port, function () {
        console.log("Сервер ожидает подключения...");
    });
});

const calculateScore = (result) => {
    let score = 0;

    if (result.gameMode === 1) {
        score = result.gameMode * 100 * ((result.cardsCount / 2) / result.wrongGuesses);
    }
    if (result.gameMode === 2) {
        score = result.gameMode * 100 * (((result.cardsCount / 2) / result.wrongGuesses) + ((result.cardsCount / 2) * (result.timer / 100)));
    }
    if (result.gameMode === 3) {
        score = result.gameMode * 100 * (((result.cardsCount / 2) / result.attemts) + ((result.cardsCount / 2) * (result.timer / 100)));
    }

    return Number(score).toFixed(1);
}


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/save-score', function (request, response) {
    let result = request.body.result;

    console.log(result);
    if (result) {
        score = calculateScore(result);
        console.log(score);

        const collection = request.app.locals.collection;
        const saveScore = {
            nickname: result.name,
            gameMode: result.gameMode,
            score: score,
        }
        collection.insertOne(saveScore, function (err, result) {
            if (err) return console.log(err);
            response.send(saveScore);
        });

    }
});

app.get('/best-scores', function (request, response) {
    const collection = request.app.locals.collection;
    collection.find({}).toArray(function (err, result) {
        if (err) throw err;
        response.send(result.sort((a, b) => {
            return a.score - b.score;
        }).slice(0, 10));
    });
});