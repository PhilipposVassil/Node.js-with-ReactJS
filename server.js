require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require("./routes/route_file");
const errorController = require("./controllers/error");

const app = express();
const port = process.env.PORT || 4000;

// enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // url of the frontend application
    credentials: true // set credentials true for secure httpOnly cookie
}));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(routes);
app.use(errorController.error404);


app.listen(port, () => {
    console.log('Server started on: ' + port);
});