const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let reg_username = req.query.username;
  let reg_password = req.query.password;
  //console.log(reg_username); 
  if (reg_username && reg_password)
  {
    let filtered_user = Object.values(users).filter((user) => user.username === reg_username);
    if (filtered_user.length>0)
    {
        res.status(400).json({message: "Error: username already exists"});
    }
    else
    {
        users.push({"username":reg_username,"password":reg_password});
        res.status(400).json({message: "Congratulations: Succesfull Registration!"});
    }
  }
  else if (!reg_username && reg_password)
  {
    res.status(400).json({message: "Check username and password"});
  }
  else if (reg_username && !reg_password)
  {
    res.status(400).json({message: "Check username and password"});
  }
  else if (!reg_username && !reg_password)
  {
    res.status(400).json({message: "Wrong Request, username and password not provided!"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //res.send(JSON.stringify({books}, null, 4));
  let getBookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve(books);
    },1000)})


  getBookPromise.then((books) => { 
    res.send(JSON.stringify({books}, null, 4));
  }) 
  .catch((error) => { 
    res.status(500).json({error: "Error: the operation failed!"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let book_isbn = req.params.isbn;
  //res.send(JSON.stringify(books[book_isbn], null, 4));
  let getBookPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        let isbn_book = books[book_isbn];
        if (isbn_book)
        {
            resolve(isbn_book);
        }
        else
        {
            reject(new Error("ISBN not found"))
        }
    },1000)})


  getBookPromise.then((isbn_book) => { 
    res.send(JSON.stringify({isbn_book}, null, 4));
  }) 
  .catch((error) => { 
    res.status(400).json({"error": error+", Error: the operation failed!"});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const book_author = req.params.author;
  //let filtered_books = Object.values(books).filter((book) => book.author === book_author);
  //res.send(filtered_books);
  let getAuthorPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        let filtered_books = Object.values(books).filter((book) => book.author === book_author);
        if (filtered_books.length>0)
        {
            resolve(filtered_books);
        }
        else
        {
            reject(new Error("Author not found"))
        }
    },1000)})


    getAuthorPromise.then((filtered_books) => { 
    res.send(JSON.stringify({filtered_books}, null, 4));
  }) 
  .catch((error) => { 
    //console.log(error);
    res.status(400).json({"error": error+", Error: the operation failed!"});
  });



});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const book_title = req.params.title;
  //let filtered_books = Object.values(books).filter((book) => book.title === book_title);
  //res.send(filtered_books);
  let getTitlePromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        let filtered_books = Object.values(books).filter((book) => book.title === book_title);
        if (filtered_books.length>0)
        {
            resolve(filtered_books);
        }
        else
        {
            reject(new Error("Title not found"))
        }
    },1000)})


    getTitlePromise.then((filtered_books) => { 
    res.send(filtered_books);
  }) 
  .catch((error) => { 
    //console.log(error);
    res.status(400).json({"error": error+", Error: the operation failed!"});
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let book_isbn = req.params.isbn;
  // Send the filtered_users array as the response to the client
  res.send(JSON.stringify(books[book_isbn].review, null, 4));
});

module.exports.general = public_users;
