const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

// db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5wiuzk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    // read data 2
    app.get('/coffee', async(req, res)=>{
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray();
      res.send(result);
      
    })

    // update 4
    app.get('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.put('/coffee/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,

        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options)
      res.send(result);
    })

    // insert data 1
    app.post('/coffee', async(req, res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);

        const result = await coffeeCollection.insertOne(newCoffee);
        res.send(result);
    })

    // delete data 3
    app.delete('/coffee/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("Coffee store opening.....");
})

app.listen(port, ()=>{
    console.log(`Example app listening ${port}`)
})