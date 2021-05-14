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
  res.render('index', {title: "Library Database", books})
}));

//New book form
router.get('/books/new', asyncHandler(async(req, res, next) => {
  res.render('new-book', {book:{}, title: "New Book"})
}));

//POST new books
router.post('/books/new', asyncHandler(async(req, res, next) => {
  const book = await Book.create(req.body);
  res.redirect('/books/' + book.id);
}));

//GET specific book
router.get('/books/:id', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('book-detail', {id:book.id, title:book.title, author:book.author, genre: book.genre, year:book.year});
}));

//Edit specific book
router.get('/books/:id/edit', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', {book, title: 'Edit' + book.title, id:req.params.id});
})); 

//Update specific book
router.post('/books/:id/edit', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect('/books/' + book.id);
}));

//Delete prompt
router.get('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  res.render('delete' , {book, title: 'Delete ' + book.title, id: req.params.id});
}));

//Deletes book from database
router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  res.redirect('/books');
}));

router.get('/error', (req,res)=>{
  const err = new Error('500s')
  err.status=500;
  next(err);
})



module.exports = router;
