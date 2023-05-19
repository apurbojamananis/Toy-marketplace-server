const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb


app.get("/", (req, res) => {
  res.send("Toy Shop is running...");
});

app.listen(port, () => {
  console.log(`Toy shop is running on port ${port}`);
});
