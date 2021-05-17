var express = require('express');
var router = express.Router();

const {Book} = require('../models/');


function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}
/* GET home page. */
router.get('/', asyncHandler(async(req, res, next) => {
  res.redirect("/books");
}));


router.get('/books', asyncHandler(async(req, res, next) => {
  const books = await Book.findAll();
  res.render('index', {books, title: "Library Database"})
}));

//New book form
router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {book:{}, title: "New Book"})
}));

//POST new books
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

//GET specific book
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book){
    res.render('book-detail', {id:book.id, title:book.title, author:book.author, genre: book.genre, year:book.year});
  } else {
    const error= new Error();
    error.message="Not Found";
    error.status=404;
    throw error
  }
}));

//Edit specific book (form)
router.get('/books/:id/edit', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('update-book', {book, title: 'Edit' + book.title, id:req.params.id});
  } else {
    const error= new Error();
    error.message="Not Found";
    error.status=404;
    throw error
  }
})); 

//Update specific book
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, errors: error.errors, title: "Edit " + book.title, id:book.id })
    } else {
      throw error;
    }
  }
}));

//Delete prompt
router.get('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render('delete' , {book, title: 'Delete ' + book.title, id: req.params.id});
  } else {
    const error= new Error();
    error.message="Not Found";
    error.status=404;
    throw error
}
}));

//Deletes book from database
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));


module.exports = router;
