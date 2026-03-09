const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register",(req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username or password missing"});
    }

    if (!isValid(username)) {
        return res.status(404).json({message: "User already exists"});
    }

    users.push({username: username, password: password});
    return res.status(200).json({message: "User registered successfully"});
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
return res.status(200).json(books);
});


public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving books"});
    }
});


public_users.get('/asyncisbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving book"});
    }
});
  
// Get book details based on author
public_users.get('/asyncauthor/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/books/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving author books"});
    }
});

// Get all books based on title
public_users.get('/asynctitle/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/books/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({message: "Error retrieving title"});
    }
});
public_users.get('/review/:isbn',function (req,res){
const isbn = req.params.isbn;
return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;

