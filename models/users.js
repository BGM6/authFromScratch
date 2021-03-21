const { Schema, model } = require('mongoose');

const userSchema = new Schema({
		username: {
				type: String,
				require: [true, 'Username cannot be blank'],
				unique: [true, 'Username already exist'],
		},

		password: {
				type: String,
				require: [true, 'Password cannot be blank'],
				min: [6, 'Password must be at least 6 characters']
		}

})

const User = model('User,', userSchema);

module.exports = User;
