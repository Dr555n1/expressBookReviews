const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    bResult=false;
    if (!username)
    {   
        bResult=false;
    }
    let filtered_user = users.filter((user) => (user.username === username));
    if (filtered_user.length>0)
    {
        bResult=true;
    }
    return bResult;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    bResult=false;
    if (isValid(username))
    {   
        let filtered_user = users.filter((user) => (user.username === username)&&(user.password===password));
        if (filtered_user.length>0)
        {
            bResult=true;
        }
        else
        {
            bResult=false;
        }
    }
    return bResult;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let reg_username = req.query.username;
  let reg_password = req.query.password;
  if (authenticatedUser(reg_username,reg_password))
  {
    console.log("Start login");
    let jwtToken = jwt.sign({data:reg_username}, 'access',{expiresIn:60*60});
    req.session.authorization = {jwtToken};
    console.log(req.session.authorization)

    console.log("End Login");
    res.send("Loggin Successful");
  }
  else
  {
    return res.status(401).json({message: "No Authorized"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  //console.log(req.params.isbn);

   let book_isbn = req.params.isbn;
   let book=books[book_isbn];
   let session_user = req.session.username;
   let new_review = req.query.review;
   let user_review = {user:session_user,review:new_review}
   //console.log(user_review);

   book.reviews = user_review;
   return res.status(201).json({message:"Review added successfully"})
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    //console.log(req.params.isbn);
  
     let book_isbn = req.params.isbn;
     let book=books[book_isbn];
     let session_user = req.session.username;
     let no_review = {}
     console.log("review delete by user",session_user);
     book.reviews = no_review;
     return res.status(201).json({message:"Reviews has been delete"})
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
