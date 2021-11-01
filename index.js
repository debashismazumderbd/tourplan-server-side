const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;
app.use(cors());
app.use(express.json());
require('dotenv').config();

//userName=dmOnTheGo
//password=uEWVvhjxhKtCgV3l
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5qv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);
async function run() {
    try {
        await client.connect();
        const database = client.db('Tourinfo');
        const servicesCollection = database.collection('Services');
        const upcomingCollection = database.collection('upcoming');
        const ClientsCollection = database.collection('Review');
        const orderCollection = database.collection('order');
        //POST-API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('service', service)
            console.log('hit the post');


            const result = await servicesCollection.insertOne(service);
            console.log(result);
            //    res.send('post hitted')
            res.json(result);
        })

        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});

            const service = await cursor.toArray();
            res.send(service);
        });
        app.get('/upcoming', async (req, res) => {
            const UpcomingCursor = upcomingCollection.find({});

            const Upcoming = await UpcomingCursor.toArray();
            res.send(Upcoming);
        });
        app.get('/review', async (req, res) => {
            const ClientsCursor = ClientsCollection.find({});

            const Client = await ClientsCursor.toArray();
            res.send(Client);
        });
        app.post('/order', async (req, res) => {
            const orders = req.body;
            // console.log('service', orders)
            // console.log('hit the post');


            const result = await orderCollection.insertOne(orders);
            // console.log(result);
            res.json(result);
        })
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});

            const order = await cursor.toArray();
            res.send(order);
        });
        app.get('/services/:serviceId', async (req, res) => {
            // const cursor=servicesCollection.findOne({_id:ObjectId(req.params.serviceId)});


            // res.json(cursor); 
            const id = req.params.serviceId;
            console.log('Getting Specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        //DELET-API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        //DELET-API
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send("server alright")
})
app.listen(port, () => {
    console.log('this is plantour server',port);
})