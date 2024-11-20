const express = require('express');
const router = express.Router();

const AccModel = require('../models/acc')
const { AccSchema } = require("../schemas/acc");

router.get('/',(req,res,next)=>{
    AccModel.find({})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({ message: 'Lỗi server' })
    })

})

router.post('/',async (req,res,next)=>{
    var email = req.body.email
    var password = req.body.password

    const existingAccount = await AccModel.findOne({ email: email });
        if (existingAccount) {
            return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống.' });
        }

    const {error} = AccSchema.validate(req.body,{abortEarly: false});
    if(error){
        const messages = error.details.map((message) => message.message)
        return res.status(400).json({
            messages,
        })
    }

    AccModel.create({
        email : email,
        password : password
    })
    .then(data=>{
        res.json({message : 'Thêm tài khoản thành công'})
    })
    .catch(err=>{
        res.status(500).json({message : 'Lỗi server'})
    })
})

router.put('/', async (req, res, next) => {
    try {
        const email = req.body.email;
        const newPass = req.body.newPass;

        // Tìm tài khoản dựa trên email
        const account = await AccModel.findOne({ email: email });

        if (!account) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }

        // Cập nhật mật khẩu
        account.password = newPass;
        await account.save();

        res.json({message:'Cập nhật mật khẩu thành công'});
    } catch (err) {
        res.status(500).json('Lỗi server');
    }
});

router.delete('/:email',(req,res,next)=>{
    var email = req.params.email
    AccModel.deleteOne({
        email : email
    })
    .then(data=>{
        res.json({message:'Xóa tài khoản thành công'})
    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Server'})
    })
})

router.post('/login', (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    AccModel.findOne({ email: email })
        .then(user => {
            if (!user) {  
                return res.json({ result: 0, message: 'Tài khoản không tồn tại' });
            }

            if (user.password === password) {
                return res.json({ result: 1, message: 'Đăng nhập thành công' });
            } else {
                return res.json({ result: 0, message: 'Mật khẩu không đúng' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json('Lỗi server');
        });
});

module.exports = router