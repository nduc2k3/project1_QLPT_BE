const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://nguyenducathang:ducthang9@cluster0.2tork.mongodb.net/DB0001?retryWrites=true&w=majority');

const AccSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength : 8
    }
}, {
    collection: "account",
    versionKey: false,
    // _id: false

});

const AccModel = mongoose.model('account',AccSchema);

module.exports = AccModel