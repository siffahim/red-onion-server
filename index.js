const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors())
app.use(express.json())

//mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyhqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect()
        const database = client.db('red-onion');
        const foodCollection = database.collection('foods');
        const orderCollection = database.collection('ordes');

        //get (Read data)
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({})
            const result = await cursor.toArray();
            res.json(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.json(result)
        })

        //all oreders oparation here--------------->

        //post (create data)
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            console.log(result)
            res.json(result)
        })

        //get 
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            console.log(req.query)
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.json(result)
        })

        app.delete('/orders', async (req, res) => {
            const id = req.query.id;
            console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('I m red onion server')
})

app.listen(port, () => {
    console.log('Running Red-onion Server', port)
})