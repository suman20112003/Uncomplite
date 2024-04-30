const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/register', async (req, res) => {
    let { email, password, username, name, age } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
        return res.status(400).send('User already exists');
    }
    try {
        let newUser = await userModel.create({ email, password, username, name, age });
        let token = jwt.sign({ email: newUser.email, userId: newUser._id }, "Sumanpingla20@");
        // console.log(token);
        res.cookie('token', token);
        res.send('Registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).send('User does not exist');
        }
        if (user.password !== password) {
            return res.status(400).send('Invalid password');
        }
        let token = jwt.sign({ email: user.email, userId: user._id }, "your-unique-secret-here");
        res.cookie('token', token);
        res.send('Logged in successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(port, err => {
    if (err) {
        console.error('Error starting server:', err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});
