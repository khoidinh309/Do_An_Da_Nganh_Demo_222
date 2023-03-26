const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
var methodOverride = require('method-override');
const route = require('./routes');
const db = require('./config/db');

db.connect();
const app = express();
const port = 8088;

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));
app.use(methodOverride('_method'));

//template engine

app.engine(
    '.hbs',
    engine({
        extname: '.hbs',
        helpers: {
            json: (data) => JSON.stringify(data)
        }
    }),
);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources/views/'));

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
