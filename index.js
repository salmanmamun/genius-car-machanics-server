const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const objectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();



const app = express();
const port = 5000;

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mldj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const servicescollection = database.collection('services')

        // Get api
        app.get('/services', async (req, res) => {

            const cursor = servicescollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting hitting specific id', id);
            const query = { _id: ObjectId(id) };
            const service = await servicescollection.findOne(query);
            res.json(service);
        })

        //post Api
        app.post('/services', async (req, res) => {

            const service = req.body;
            console.log('hit the post api', service);


            const result = await servicescollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // Delete API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicescollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }


}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Geneous server');
});


app.listen(port, () => {
    console.log('runnning Geneous server on Port', port);
})