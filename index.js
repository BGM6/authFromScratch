const express = require('express');
const PORT = 3000;
const mongoose = require('mongoose');
const path = require('path');
//auth
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authScratch', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'))
db.once('OPEN', () => {
		console.log('DATABASE CONNECTED');
})

const app = express();

//ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
		console.log(`SERVER LISTENING ON PORT ${PORT}`);
})
