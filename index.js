const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
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
app.set('views', path.join(__dirname, 'views'));

//middleware
const requireLogin = (req, res, next) => {
		if(!req.session.user_id) {
				return res.redirect('/login');
		} else {
				next();
		}
}
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
		const user = new User({username, password});
		await user.save();
		req.session.user_id = user._id;
		res.redirect('/')
})

// app.post('/register', async (req, res) => {
// 		const { password, username } = req.body;
// 		const hash = await bcrypt.hash(password, 12);
// 		const user = new User({
// 				username,
// 				password: hash,
// 		})
// 		await user.save();
// 		req.session.user_id = user._id;
// 		res.redirect('/')
// })

//Login
app.get('/login', (req, res) => {
		res.render('login');
})

app.post('/login', async (req, res) => {
		const { password, username } = req.body;
		const foundUser = await User.findAndValidate(username, password);
		if(foundUser) {
				req.session.user_id = foundUser._id;
				res.redirect('/secret');
		} else {
				res.redirect('/login');
		}

})

// app.post('/login', async (req, res) => {
// 		const {username, password} = req.body;
// 		const user = await User.findOne({username});
// 		const validPassword = await bcrypt.compare(password, user.password);
// 		if(validPassword) {
// 				req.session.user_id = user._id;
// 				res.redirect('/secret');
// 		} else {
// 				res.redirect('/login');
// 		}
// })

//logout
app.post('/logout', (req, res) => {
		req.session.user_id = null;
		res.redirect('/login');
})

//protected route
app.get('/secret', requireLogin, (req, res) => {
		// if(!req.session.user_id) {
		// 		return res.redirect('/login');
		// }
		res.render('secret');
})

app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
})
