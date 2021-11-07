require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');

// Importing Different Schema

const BookModel = require("./schema/book");
const AuthorModel = require("./schema/author");
const PublicationModel = require("./schema/publication");

//API
const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");

//database
const Database = require("./database");

//initialization

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("connection established!!"))
    .catch((err) => {
        console.log(err);
    });

const ourAPP = express();

ourAPP.use(express.json());

ourAPP.use("/book", Book );
ourAPP.use("/author", Author );
ourAPP.use("/publication", Publication );


ourAPP.get("/", (req, res) => {
    res.json({
        message: "Request Served!!!!!"
    });
});


ourAPP.listen(4000, () => console.log("Server is running"));