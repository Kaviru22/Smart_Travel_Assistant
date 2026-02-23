const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res)=> res.send("Smart Travel Assistant Backend OK"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log("Backend running on port", PORT));