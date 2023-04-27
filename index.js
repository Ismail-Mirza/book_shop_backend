const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express();
app.use(cors());
app.use(bodyParser.json());
// const uri = process.env.DB_PATH;

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const updateTime = day + "-" + month + "-" + year;

const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://ismailmirza:cWvENQ!twkER4Lm@cluster0.ivgbd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(err=> {
  if (err) {
    console.log("Failed to connect to database:", err);
    return;
  }

  console.log("Connected to database");

  // Define your endpoints here...
  app.get("/", (req, res) => {
    res.send("Hello, world!");
  });
  app.get("/allBooks", (req, res) => {
      const collection = client.db("boiwala").collection("allBooks");
      collection.find().toArray((err, documents) => {
        if (err) {
          res.status(500).send({
            message: err,
          });
        } else {
          res.send(documents);
        }}
        );
    // res.send("hi")
  });
  app.get("/allBooks/:key", (req, res) => {
    const id = req.params.id;
      const collection = client.db("boiwala").collection("allBooks");
      collection.find({ id }).toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents[0]);
        }
      });
  });

  app.post("/addBooks", (req, res) => {
    const allBooks = req.body;
    allBooks.addedTime = updateTime;
      const collection = client.db("boiwala").collection("allBooks");
      collection.insertOne(allBooks, (err, result) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          res.send(result.ops[0]);
        }
      });
  });

  app.post("/placeOrder", (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = updateTime;
      const collection = client.db("boiwala").collection("orders");
      collection.insertOne(orderDetails, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(result.ops[0]);
        }
      });
  });

  app.get("/orders", (req, res) => {
      const collection = client.db("boiwala").collection("orders");
      collection.find().toArray((err, documents) => {
        if (err) {
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });
  });
  app.listen(4000, () => {
    console.log("Server started on port 4000");
  });
});
