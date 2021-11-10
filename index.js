const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;




/* -------------------MiddleWare----------------*/

app.use(cors());
app.use(express.json());

/* -------------------End of MiddleWare----------------*/

/* -------------------MongoDB Connection----------------*/
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzgvu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* ----------------End of MongoDB Connection----------------*/

/*---------CRUD Operation------------*/
async function run() {
    try {
      await client.connect();
      console.log('Database Connection Established!');


      const database = client.db("autoRepublic");
      const productCollection = database.collection("products");


      /*-------------GET API--------------*/
      app.get('/products', async(req,res) => {
          const cursor = productCollection.find({});
          const result = await cursor.toArray();
          res.json(result);
      })

    //   get product by id

    app.get("/products/:id", async(req,res) => {
        const query = {_id:ObjectId(req.params.id)}
        const product = await productCollection.findOne(query);
        res.json(product);
    })
      /*-------------end of GET API--------------*/

      /*--------POST API----------*/
      app.post("/products", async(req,res)=>{
          console.log(req.body);
          const product = req.body;
          const result = await productCollection.insertOne(product);
          res.send(result);
      })

      /*--------end of POST API----------*/
    } finally {

    }
  }
  run().catch(console.dir);
/*---------end of CRUD Operation------------*/


/* -------------------Page Initialization----------------*/

app.get('/', (req, res) =>{
    res.send("Welcome to Auto Republic Server!");
});

app.listen(port,()=>{
    console.log("Server is running on PORT", port);
});

/* ---------------End of Page Initialization---------------*/