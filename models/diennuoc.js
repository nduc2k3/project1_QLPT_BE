const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://nguyenducathang:ducthang9@cluster0.2tork.mongodb.net/DB0001?retryWrites=true&w=majority');

const DnSchema = new Schema({
    madn: {
         type: String,
         required: true ,
         unique: true
    },
    makt: {
         type: String,
         required: true
    },
    thang: { 
        type: Number, 
        required: true
    },
    nam: { 
         type: Number,
         required: true
    },
    sodien: { 
         type: Number,
         required: true 
        },
    sonuoc: {
         type: Number, 
         required: true 
        },
    giadien: { 
         type: Number,
         required: true },
    gianuoc: { 
         type: Number, 
         required: true 
        }
}, {
    collection: "diennuoc"
});

const DnModel = mongoose.model('diennuoc',DnSchema);

module.exports = DnModel