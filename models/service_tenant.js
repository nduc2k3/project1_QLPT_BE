const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb+srv://nguyenducathang:ducthang9@cluster0.2tork.mongodb.net/DB0001?retryWrites=true&w=majority');

const CounterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', CounterSchema);

const STSchema = new Schema({
    mast: { 
        type: String,
        unique: true
    },
    makt: { 
        type: String, 
        required: true 
    },
    madv: { 
        type: String, 
        required: true 
    },
    soluong: { 
        type: Number, 
        required: true }
}, {
    collection: "service_tenant"
});

STSchema.pre('save', async function(next) {
    const doc = this;
    if (!doc.mast) {
        try {
            let counter = await Counter.findOne({ _id: 'mast_seq' });
            
            if (!counter ) {
                counter = new Counter({ _id: 'mast_seq', seq: 0 }); // Bắt đầu từ 1
            }

            const paddedSeq = String(counter.seq).padStart(2, '0');
            doc.mast = `ST${paddedSeq}`;
            counter.seq++; // Tăng giá trị seq cho lần tiếp theo
            await counter.save();

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const STModel = mongoose.model('ServiceTenant', STSchema);

module.exports = STModel;