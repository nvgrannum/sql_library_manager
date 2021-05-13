var express = require('express');
var router = express.Router();

const {Book} = require('../models');


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
  console.log(books);
  //res.json(books);
  res.render('index', {title: "Library Database", books})
}));

router.get('/books/new', asyncHandler(async(req, res, next) => {
  console.log('add a new book');
  res.render('new-book', {book:{}, title: "New Book"})
}));

//POST new books
router.post('/books/new', asyncHandler(async(req, res, next) => {
  const book = await Book.create(req.body);
  res.redirect('/books/' + book.id);
}));

//GET specific book
// router.get('/books/:id', asyncHandler(async(req, res, next) => {
//   const book = await Book.findByPk(req.params.id);
//   res.redirect('/books/' + book.id);
//}));

//Edit specific book
// router.get('/books/:id/edit', asyncHandler(async(req, res, next) => {
//   const book = await Book.findByPk(req.params.id);
//   res.render('update-book', {article, title: 'Edit' + article.title, id:req.params.id});
//}));

//Update specific book
// router.post('/books/:id/edit', asyncHandler(async(req, res, next) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.update(req.body);
//   res.redirect('/books/' + book.id);
//}));

//Delete prompt
// router.get('/books/:id/delete', asyncHandler(async(req, res, next) => {
//   const book = await Book.findByPk(req.params.id);
//   res.render('delete' , {article, title: 'Delete' + article.title, id: req.params.id});
//}));

//Deletes book from database
// router.post('/books/:id/delete', asyncHandler(async(req, res, next) => {
//   const book = await Book.findByPk(req.params.id);
//   await book.destroy();
//   res.redirect('/books');
//}));

module.exports = router;