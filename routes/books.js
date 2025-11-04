const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const bookController = require('../controllers/bookController');

// enable ?_method=PUT/DELETE or hidden input _method
router.use(methodOverride('_method'));

router.get('/', (req, res) => res.redirect('/books'));

// index + new + create (you already have these)
router.get('/books', bookController.listBooks);
router.get('/books/new', bookController.newBookForm);
router.post('/books', bookController.createBook);

// Crash Route for demo only
router.get("/books/crash", (req, res) => {
    throw new Error("Intentional Crash")
});

// NEW: show one book
router.get('/books/:id', bookController.showBook);

// NEW: edit form
router.get('/books/:id/edit', bookController.editBookForm);


// NEW: update (via PUT)
router.put('/books/:id', bookController.updateBook);

// NEW: delete (via DELETE)
router.delete('/books/:id', bookController.deleteBook);



module.exports = router;

