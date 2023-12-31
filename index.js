const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => res.send(posts));

app.post("/posts", async (req, res) => {
  try {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    const postData = {
      id,
      title,
    };

    posts[id] = postData;

    await axios.post("http://localhost:4005/events", {
      type: "PostCreated",
      data: postData,
    });

    return res.status(201).send(posts[id]);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error");
  }
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
