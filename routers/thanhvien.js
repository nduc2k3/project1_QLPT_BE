const express = require('express');
const router = express.Router();

const TvModel = require('../models/thanhvien')

router.get('/',(req,res,next)=>{
    TvModel.find({})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Server'})
    })

})

router.post('/', async (req, res, next) => {
    var makt = req.body.makt
    var tentv = req.body.tentv
    var ngaysinh = req.body.ngaysinh
    var gioitinh = req.body.gioitinh
    var cccd = req.body.cccd
    var diachi = req.body.diachi
    var sdt = req.body.sdt

    const count = await TvModel.countDocuments({ makt: makt });

    if (count >= 3) {
        return res.status(400).json({message:'Chỉ được thêm tối đa 4 thành viên cho mỗi mã khách thuê.'});
    }

    const existingTv = await TvModel.findOne({ cccd: cccd });

    if (existingTv) {
        return res.status(400).json({message:'Số CCCD đã tồn tại trong cơ sở dữ liệu.'});
    }

    
    TvModel.create({
        makt: makt,
        tentv : tentv,
        ngaysinh : ngaysinh,
        gioitinh : gioitinh,
        cccd : cccd,
        diachi: diachi,
        sdt: sdt

    })
        .then(data => {
            res.json({message:'thêm thành viên thành công'})
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.delete('/:cccd',(req,res,next)=>{
    var cccd = req.params.cccd
    TvModel.deleteOne({
        cccd : cccd
    })
    .then(data=>{
        res.json({message:'Xóa thành công'})
    })
    .catch(err=>{
        res.status(500).json({message:'loi sever'})
    })
})



router.put('/:cccd', (req, res, next) => {
    const cccd = req.params.cccd;

    TvModel.findOneAndUpdate({ cccd : cccd }, req.body, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({message:'Không tìm thấy thành viên để cập nhật'});
            }
            res.json({message:'Cập nhật thành viên thành công'});
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi server khi cập nhật thanh vien'});
        });
});


module.exports = router