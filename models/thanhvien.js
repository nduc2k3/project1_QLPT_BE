const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://nguyenducathang:ducthang9@cluster0.2tork.mongodb.net/DB0001?retryWrites=true&w=majority');

const TvSchema = new Schema({
    makt: { 
        type: String,
        required: true,
        unique: false
    },
    tentv: { 
        type: String, 
        required: true 
    },
    ngaysinh: { 
        type: Date 
    },
    gioitinh: { 
        type: String 
    },
    cccd: { 
        type: String,
        required: true, 
    }, 
    diachi: { 
        type: String 
    },
    sdt: { 
        type: String 
    }
}, {
    collection: "thanhvien",
});

const TvModel = mongoose.model('thanhvien',TvSchema);

module.exports = TvModel