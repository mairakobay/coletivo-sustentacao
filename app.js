// requirements
var createError = require('http-errors');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const mysql = require('mysql2/promise');

const session = require('express-session');

// app configuration
const app = express();

// template engine configuration
app.use(expressEjsLayouts);
app.set('layout', './layouts/base.ejs');
app.set('view engine', 'ejs');

app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
}));


// serving static files 
app.use(express.static('public'));

// form body data
app.use(express.urlencoded({ extended: false }));  //pegar os dados do formulario

// database configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'dbSalad'
});

app.get('/login', (req, res) => {
    res.render('auth/login')
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const sql = 'SELECT * FROM user WHERE email = ? limit 1';
        const [rows, fields] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            return res.redirect('/login');
        }
        if (password != rows[0].password) {
            return res.redirect('/login');
        }
        req.session.user = rows[0]
        res.redirect('/')
    } catch (error) {
        console.error(error);
        throw new Error('Ocorreu um erro ao buscar o usuário por nome de usuário ou email.');
    }
});

app.get('/', async (req, res, next) => {
    try {
        console.log(req.session)
        const sql = `SELECT * FROM salads;`;
        const [rows] = await pool.query(sql);

        res.render('index', { produtos: rows });
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao carregar os dados dos produtos.'));
    }
});

// products create/new
app.get('/saladas/cadastrar', async (req, res, next) => {
    res.render('products/create');
});

// products store/save
app.post('/saladas/cadastrar', async (req, res, next) => {
    try {
        const { name, price, size } = req.body;

        const sql = 'INSERT INTO salads (name, price, size) VALUES (?, ?, ?);';
        const values = [name, price, size];
        const [rows, fields] = await pool.query(sql, values);

        const insertedId = rows.insertId;
        res.redirect(`/saladas/${insertedId}`);
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao cadastrar o produto.'));
    }
});

// products show/details
app.get('/saladas/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const sql = `SELECT * FROM salads WHERE id = ?;`;
        const values = [id];
        const [rows] = await pool.query(sql, values);

        if (rows.length === 0) {
            next(createError(404));
        }

        return res.render('products/show', { product: rows[0] });
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao carregar os dados do produto.'));
    }
});

// products edit
app.get('/saladas/:id/editar', async (req, res, next) => {
    try {
        const { id } = req.params;

        const sql = `SELECT * FROM salads WHERE id = ?;`;
        const values = [id];
        const [rows] = await pool.query(sql, values);

        if (rows.length === 0) {
            next(createError(404));
        }

        return res.render('products/edit', { product: rows[0] });
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao carregar os dados do produto.'));
    }
});

// products update
app.post('/saladas/:id/editar', async (req, res, next) => {
    try {
        const { name, price, size } = req.body;
        const { id } = req.params;

        const sql = "UPDATE `salads` SET `name` = ?, `size` = ?, `price` = ? WHERE `id` = ?;";
        const values = [name, size, price, id];
        const [rows] = await pool.query(sql, values);

        // console.log(rows);

        res.redirect(`/saladas/${id}`);
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao cadastrar o produto.'));
    }
});

// products destroy/delete
app.post('/saladas/:id/deletar', async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM salads WHERE id = ?;`;
        const values = [id];
        const [rows] = await pool.query(sql, values);
        console.log(rows);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao deletar o produto.'));
    }
});

////////

// user create/new
app.get('/usuarios/cadastrar', async (req, res, next) => {
    res.render('users/create');
});

// user/save
app.post('/usuarios/cadastrar', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?);';
        const values = [name, email, password];
        const [rows] = await pool.query(sql, values);

        const insertedId = rows.insertId;

        res.redirect(`/`);
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao cadastrar o usuário.'));
    }
});

// user/delete
app.post('/usuarios/:id/deletar', async (req, res, next) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM user WHERE id = ?;`;
        const values = [id];
        const [rows] = await pool.query(sql, values);
        console.log(rows);
        return res.redirect('/');
    } catch (err) {
        console.error(err);
        next(new Error('Ocorreu um erro ao deletar o usuário.'));
    }
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    if (err.status === 404) {
        res.render('404');
    } else {
        res.render('error');
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});



/* App.js - login


const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session');

const checkLoggedIn = require('./middlewares/checkLoggedIn');

const indexRouter = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(checkLoggedIn);

app.use('/', indexRouter);
app.use('/usuarios', userRoutes);
app.use('/autenticacao', authRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.error = {
    message: err.message,
    status: err.status || 500,
    stack: req.app.get('env') === 'development' ? err.stack : '',
  };

  res.status(res.locals.error.status);
  res.render('error');
});

module.exports = app;

*/
