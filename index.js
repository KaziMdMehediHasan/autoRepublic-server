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
      const orderCollection = database.collection("orders");
      const userCollection = database.collection("users");
      const reviewCollection = database.collection("reviews");


      /*-------------GET API--------------*/
      app.get('/products', async(req,res) => {
          const cursor = productCollection.find({});
          const result = await cursor.toArray();
          res.json(result);
      })

      app.get("/orders", async(req,res)=>{
        const cursor = orderCollection.find({});
        const result = await cursor.toArray();
        res.json(result);
      })

    //   get product by id

    app.get("/products/:id", async(req,res) => {
        const query = {_id:ObjectId(req.params.id)}
        const product = await productCollection.findOne(query);
        res.json(product);
    })



    // get order by user email
    app.get("/orders/:email", async(req,res) => {
      const email = req.params.email;
      const query = {email:email}
      const result = await orderCollection.find(query).toArray();
      res.json(result);
    })

    app.get("/users/:email", async(req,res) => {
      const email = req.params.email;
      const query = {email:email};
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === "admin"){
        isAdmin = true;
      }
      res.json({admin: isAdmin});
    })
      /*-------------end of GET API--------------*/

      /*--------POST API----------*/
      app.post("/products", async(req,res)=>{
          console.log(req.body);
          const product = req.body;
          const result = await productCollection.insertOne(product);
          res.send(result);
      })

      app.post("/orders", async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result);
      })

      // send user data to database

      app.post('/users', async(req,res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        console.log(result);
        res.json(result);
      })

      app.post("/reviews", async(req,res)=>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        console.log(result);
        res.json(result);
      })


      /*--------end of POST API----------*/

      /*----------UPDATE API----------*/
      app.put('/users', async(req,res)=>{
        const user = req.body;
        const filter = {email: user.email};
        const options = {upsert: true};
        const updateDoc = {
          $set: user
        }
        const result = await userCollection.updateOne(filter,updateDoc, options);
        res.json(result);
      });

      app.put("/users/admin", async(req,res)=>{
        const user = req.body;
        console.log('put', user);
        const filter = {email: user.email};
        const updateDoc = {$set:{role: 'admin'}};
        const result = await userCollection.updateOne(filter,updateDoc);
        res.json(result);
      })
      /*----------end of UPDATE API----------*/


      /*-----------Delete API----------*/
      app.delete("/orders/:id", async(req,res)=>{
        const query = {_id:ObjectId(req.params.id)};
        const result = await orderCollection.deleteOne(query);
        res.json(result);
        console.log(result);
      })

      //delete product by admin

      app.delete('/products/:id', async(req,res)=>{
        const query = {_id:ObjectId(req.params.id)};
        const result = await productCollection.deleteOne(query);
        res.json(result);
        console.log(result);
      })

      /*-----------end of Delete API----------*/
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