require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const md5 = require('md5');const path = require('path');
const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const rateLimit = require('express-rate-limit')
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 2, 
  message: 'Too many failed login attempts, please try again later.'
});
const UsersTable = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});


async function hashpass(pass) {
  try {
    const hashedpass = await md5(pass);
    return hashedpass;
  } catch (e) {
    console.error(e);
  }
}


async function connectToMongoDB() {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
  }
}



app.post('/register',async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = await hashpass(password);
    const User = mongoose.model('User', UsersTable);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Failed to register user');
  }
});



app.post('/login', loginLimiter,async (req, res) => {
    const User = mongoose.model('User', UsersTable);
    try {
      const { name, email, password } = req.body;
      console.log(req.body);
      const hashedPassword = await hashpass(password);
      const user = await User.findOne({ name: name, email: email, password: hashedPassword });
      console.log(user);
      if (user) {
        res.status(200).send('User login successful');
      } else {
        res.status(404).send('User not found or incorrect credentials');
      }
    } catch (error) {
      console.error('Error logging user:', error);
      res.status(500).send('Failed to sign in user');
    }
  });




async function startServer() {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
startServer();