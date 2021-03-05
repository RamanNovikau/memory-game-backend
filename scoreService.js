
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb+srv://memory-game:ePWMNoNJtnrvZ4dv@cluster0.bsofz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
let dbClient;

client.connect((err, client) => {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("memory-game-score").collection("score");
    app.listen(3000, function () {
        console.log("Сервер ожидает подключения...");
    });
});