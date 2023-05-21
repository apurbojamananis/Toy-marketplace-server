const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orqgdcn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db("toyShop").collection("toys");
    const blogsCollection = client.db("toyShop").collection("blogs");

    // get all data from mongodb

    app.get("/alltoys", async (req, res) => {
      const limit = parseInt(req.query.limit) || 20;
      const result = await toysCollection.find().limit(limit).toArray();
      res.send(result);
    });

    // get data by sub category
    app.get("/shopByCategory/:subcategory", async (req, res) => {
      const subcategory = req.params.subcategory;

      const query = { subCategory: subcategory };
      const options = {};
      const result = await toysCollection.find(query, options).toArray();
      res.send(result);
    });

    // get data by id

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {};
      const result = await toysCollection.findOne(query, options);
      res.send(result);
    });

    // get data by user
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const options = {};
      const result = await toysCollection.find(query, options).toArray();
      console.log(result);
      res.send(result);
    });

    // post data to mongodb
    app.post("/allToys", async (req, res) => {
      const toys = req.body;
      console.log(toys);
      const result = await toysCollection.insertOne(toys);
      res.send(result);
    });

    // update data to mongodb
    app.put("/updateToy/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      console.log(updatedToy);
      const toy = {
        $set: {
          ToyName: updatedToy.ToyName,
          photoURL: updatedToy.photoURL,
          subCategory: updatedToy.subCategory,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
        },
      };

      const result = await toysCollection.updateOne(filter, toy, options);

      res.send(result);
    });

    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // blogs get
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("toyShop").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toy Shop is running...");
});

app.listen(port, () => {
  console.log(`Toy shop is running on port ${port}`);
});
