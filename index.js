const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;

//Database uri string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
     try{
          await client.connect();
          
          const database = client.db("UnitedDB");
          const servicesCollection = database.collection("services");

          //GET API 
          app.get('/services', async(req, res)=>{
               const cursor = servicesCollection.find({});
               const result = await cursor.toArray();
               res.json(result)
          })

          //Get single service with id
          app.get('/services/:id', async(req, res)=>{
               const id = req.params.id;
               const qurey = { _id: ObjectId(id)}
               const result = await servicesCollection.findOne(qurey);
               res.json(result)
          })

     }
     finally{
          // await client.close()
     }
}
run().catch(console.dir)

app.get('/', (req, res)=>{
     res.send('Running my United Way server')
})

app.listen(port, ()=>{
     console.log('Listening The Port', port);
})