const express = require('express');
const router = express.Router();

const DvModel = require('../models/dichvu')

router.get('/',(req,res,next)=>{
    DvModel.find({})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Sever'})
    })

})

router.post('/',(req,res,next)=>{
    var madv = req.body.madv
    var tendv = req.body.tendv
    var giatien = req.body.giatien
    DvModel.findOne({ madv: madv })
        .then(existingData => {
            if (existingData) {
                return res.status(400).json({message:'Mã dịch vụ đã tồn tại.'});
            }

            // Nếu 'madv' chưa tồn tại, thêm bản ghi mới
            DvModel.create({
                madv: madv,
                tendv: tendv,
                giatien: giatien
            })
                .then(data => {
                    res.json({message:'Thêm dịch vụ thành công'});
                })
                .catch(err => {
                    res.status(500).json({message:'Lỗi server'});
                });
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi server'});
        });
})

router.put('/:madv', (req, res, next) => {
    const madv = req.params.madv;

    DvModel.findOneAndUpdate({ madv : madv }, req.body, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({message:'Không tìm thấy dich vu để cập nhật'});
            }
            res.json({message:'Cập nhật dich vu thành công'});
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi server khi cập nhật dịch vụ'});
        });
});

router.delete('/:madv',(req,res,next)=>{
    var madv = req.params.madv
    DvModel.deleteOne({
        madv : madv
    })
    .then(data=>{
        res.json({message:'Xóa thành công'})
    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Sever'})
    })
})


module.exports = router