const express = require('express');
const cors = require('cors');
require("dotenv").config();
const {MongoClient} = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;




/* -------------------MiddleWare----------------*/

app.use(cors());
app.use(express.json());

/* -------------------End of MiddleWare----------------*/

/* -------------------MongoDB Connection----------------*/


/* ----------------End of MongoDB Connection----------------*/


/* -------------------Page Initialization----------------*/

app.get('/', (req, res) =>{
    "Welcome to Auto Republic Server!"
});

app.listen(port,()=>{
    console.log("Server is running on PORT", port);
});

/* ---------------End of Page Initialization---------------*/