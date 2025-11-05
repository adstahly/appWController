// app.js
const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');

const app = express();

// Body parsing + static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine: express-handlebars using .hbs + layout
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Make {{year}} available to all views
app.use((req, res, next) => { res.locals.year = new Date().getFullYear(); next(); });

// Enable PUT/DELETE via forms using ?_method= or a hidden input named _method
app.use(methodOverride('_method'));

// Mount routes (kept exactly like your original)
const bookRoutes = require('./routes/books');
app.use('/', bookRoutes);

// 404 + 500 handlers
app.use((req, res) => res.status(404).render('404', { title: 'Not Found' }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('500', { title: 'Server Error' });
});

// Start server
const PORT = 3333;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
