const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://nguyenducathang:ducthang9@cluster0.2tork.mongodb.net/DB0001?retryWrites=true&w=majority');

const RoomSchema = new Schema({
    maphong: { 
        type: String,
        required: true,
        unique: true 
    },
    tenphong: { 
        type: String, 
        required: true 
    },
    tang: { 
        type:Number, 
        required: true 
    },
    trangthaiphong: { 
        type: Boolean, 
        default: false 
    },
    trangthaitt: { 
        type: Boolean, 
        default: false 
    },
    hinhanh: { 
        type: String 
    },
    giaphong: { 
        type: Number,
        required: true 
    },
    mota: { 
        type: String 
    }
}, {
    collection: "room"
});

const RoomModel = mongoose.model('room',RoomSchema);

module.exports = RoomModel