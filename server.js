const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const HttpError = require('./errors/http-error');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use('/api/auth',  require('./routes/auth-routes'));
app.use('/api/profile', require('./routes/profile-routes'));
app.use('/api/bail', require('./routes/bail-router'));

app.use((req, res, next) => {
    const error = new HttpError('Cold not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSend) {
        return next(error);
    }
    res.status(error.code || 500).json({
        message: error.message || 'An unknown error occorred!',
    });
});

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    app.listen(5000);
    console.log("Server raning at - http://localhost:5000");
}).catch((err) => {
    console.log(err);
});
// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-wvdaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
//     .then(() => {
//         app.listen(process.env.PORT || 5000);
//     }).catch((err) => {
//         console.log(err);
//     });