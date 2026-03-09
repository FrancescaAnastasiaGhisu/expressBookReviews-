const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username ===username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;
   
    if(!username || !password){
      return res.status(400).json({
        message: "Username or password missing"
      });
    }
   
    let user = users.find(u => u.username === username && u.password === password);
   
    if(user){
   
      let accessToken = jwt.sign({data: username}, "access", {expiresIn: 60*60});
   
      req.session.authorization = {
        accessToken: accessToken,
        username: username
      };
   
      return res.status(200).json({
        message: "User logged in successfully"
      });
    }
   
    return res.status(401).json({
      message: "Invalid login"
    });
   });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

 const isbn = req.params.isbn;
 const review = req.body.review;
 const username = req.session.authorization.username;

 books[isbn].reviews[username] = review;

 return res.status(200).json({
   message: "Review added or updated successfully"
 });

});
regd_users.delete("/auth/review/:isbn", (req, res) => {

 const isbn = req.params.isbn;
 const username = req.session.authorization.username;

 delete books[isbn].reviews[username];

 return res.status(200).json({
   message: "Review deleted successfully"
 });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
