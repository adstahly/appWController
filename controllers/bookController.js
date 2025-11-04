const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'books.json');

// ----- Helper functions -----
function readBooks() {
    if (!fs.existsSync(DATA_PATH)) return [];
    const raw = fs.readFileSync(DATA_PATH, 'utf8') || '[]';
    return JSON.parse(raw);
}

function writeBooks(list) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(list, null, 2), 'utf8');
}

// ----- Controller actions -----

// GET /books - list all books
exports.listBooks = (req, res) => {
    const books = readBooks();
    res.render('books', { title: 'Books', books });
};

// GET /books/new - show form to add a new book
exports.newBookForm = (req, res) => {
    res.render('newBook', { title: 'Add Book' });
};

// POST /books - create a new book
exports.createBook = (req, res) => {
    const { title, author, isbn } = req.body;
    const errors = [];

    if (!title || !title.trim()) errors.push('Title is required.');
    if (!author || !author.trim()) errors.push('Author is required.');

    if (errors.length) {
        return res.status(400).render('newBook', {
            title: 'Add Book',
            errors,
            values: { title, author, isbn }
        });
    }

    const books = readBooks();
    const newBook = {
        id: 'b_' + Date.now(),
        title: title.trim(),
        author: author.trim(),
        isbn: (isbn || '').trim()
    };

    books.push(newBook);
    writeBooks(books);

    res.redirect('/books'); // PRG pattern
};

// GET /books/:id - show one book
exports.showBook = (req, res) => {
    const books = readBooks();
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).render('404', { title: 'Book Not Found' });

    res.render('bookShow', { title: book.title, book });
};

// GET /books/:id/edit - show edit form
exports.editBookForm = (req, res) => {
    const books = readBooks();
    const book = books.find(b => b.id === req.params.id);
    if (!book) return res.status(404).render('404', { title: 'Book Not Found' });

    res.render('bookEdit', { title: `Edit: ${book.title}`, book });
};

// PUT /books/:id - update book info
exports.updateBook = (req, res) => {
    const { title, author, isbn } = req.body;
    const errors = [];

    if (!title || !title.trim()) errors.push('Title is required.');
    if (!author || !author.trim()) errors.push('Author is required.');

    const books = readBooks();
    const index = books.findIndex(b => b.id === req.params.id);
    if (index < 0) return res.status(404).render('404', { title: 'Book Not Found' });

    if (errors.length) {
        return res.status(400).render('bookEdit', {
            title: 'Edit Book',
            errors,
            book: { ...books[index], title, author, isbn }
        });
    }

    books[index] = {
        ...books[index],
        title: title.trim(),
        author: author.trim(),
        isbn: (isbn || '').trim()
    };

    writeBooks(books);
    res.redirect(`/books/${books[index].id}`);
};

// DELETE /books/:id - remove a book
exports.deleteBook = (req, res) => {
    const books = readBooks();
    const exists = books.some(b => b.id === req.params.id);

    if (!exists) return res.status(404).render('404', { title: 'Book Not Found' });

    const remaining = books.filter(b => b.id !== req.params.id);
    writeBooks(remaining);

    res.redirect('/books');
};
