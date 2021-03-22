const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PORT = 5000;
const app = express();
const User = require('./models/user');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/authFromScratch', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
}).then(() => console.log('Success'));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
		console.log('Connected to MongoDB');
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));
//Session setup
app.use(session({secret: 'monkey123'}));

app.get('/', (req, res) => {
		res.send('Welcome to the homepage');
})

//Register
app.get('/register', (req, res) => {
		res.render('register')
})

app.post('/register', async (req, res) => {
		const { password, username } = req.body;
		const hash = await bcrypt.hash(password, 12);
		const user = new User({
				username,
				password: hash,
		})
		await user.save();
		res.session.user_id = user._id;
		res.redirect('/')
})

//Login
app.get('/login', (req, res) => {
		res.render('login');
})

app.post('/login', async (req, res) => {
		const {username, password} = req.body;
		const user = await User.findOne({username});
		const validPassword = await bcrypt.compare(password, user.password);
		if(validPassword) {
				req.session.user_id = user._id;
				res.redirect('/secret');
		} else {
				res.redirect('/login');
		}
})

app.get('/secret', (req, res) => {
		if(!req.session.user_id) {
				res.redirect('/login');
		}
		res.send('SECRET ROUTE YOU CAN ONLY SEE IF YOU ARE LOGGED IN!')
})

app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
})
