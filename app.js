//modul 
var express = require('express')
var hbs = require('hbs')
//su dung hbs
var app = express()
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');

//doc du lieu
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));// lay file public

//ket noi db
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://bunchatrada:bunchatrada123@bunchatrada.vqycr.mongodb.net/test'

app.get('/', (req, res) => {
    res.redirect('/login')
});

app.get('/login', (req, res) => {
    res.render('login')
});

app.get('/doLogout', (req, res) => {
    res.redirect('/login');
});

app.post('/doLogin', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    let dbo = client.db("assignment");
    let results = await dbo.collection("user").
        find({ username: username, password: password }).toArray();

    if (results.length > 0) {
        res.redirect('/index');
    }
    else {
        res.render('login', { error: "Incorrect, Please try again!" });
    }
});

app.get('/index', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("assignment");
    let results = await dbo.collection("Shoes").find({}).toArray();
    res.render('index', { model: results })
})


app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/doAdd', async (req, res) => {
    let nameInput = req.body.nameShoe;
    let colorInput = req.body.colorShoe;
    let typeInput = req.body.typeShoe;
    let sizeInput = req.body.sizeShoe;
    let brandInput = req.body.brandShoe;
    let amountInput = req.body.amountShoe;
    let priceInput = req.body.priceShoe;
    let newShoe = {
        NameShoe: nameInput,
        color: colorInput,
        type: typeInput,
        size: sizeInput,
        brand: brandInput,
        amount: amountInput,
        price: priceInput,

    }
    let client = await MongoClient.connect(url)
    let dbo = client.db("assignment");
    await dbo.collection("Shoes").insertOne(newShoe);
    res.redirect('/index')
});

app.get('/delete', async (req, res) => {
    //id: string from URL
    let id = req.query.id;
    //convert id from URL to MongoDB' id
    let ObjectID = require('mongodb').ObjectID(id);
    //the conditon to delete
    let condition = { '_id': ObjectID }
    let client = await MongoClient.connect(url);
    let dbo = client.db("assignment");
    await dbo.collection("Shoes").deleteOne(condition);
    res.redirect('/index');
})

const PORT = process.env.PORT || 9999;
app.listen(PORT)
console.log("Server is running on port: " + PORT)