const express = require('express');
const router = express.Router();

const STModel = require('../models/service_tenant')


router.get('/',(req,res,next)=>{
    STModel.find({})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Server'})
    })

})

router.post('/', async (req, res, next) => {
    
        const makt = req.body.makt;
        const madv = req.body.madv;
        const soluong = req.body.soluong;

        const existingST = await STModel.findOne({ makt: makt, madv: madv });

    if (existingST) {
        return res.status(400).json({message:'khách thuê đã có dịch vụ này.'});
    }


        const newST = new STModel({
            makt: makt,
            madv: madv,
            soluong: soluong
        });

        await newST.save();

        res.json({message:'Thêm dịch vụ khách thuê thành công'});
    
});

router.put('/:mast', (req, res, next) => {
    const mast = req.params.mast;

    STModel.findOneAndUpdate({ mast : mast }, req.body, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({message:'Không tìm thấy dịch vụ khách thuê để cập nhật'});
            }
            res.json({message:'Cập nhật dịch vụ khách thuê thành công'});
        })
        .catch(err => {
            res.status(500).json('Lỗi server khi cập nhật');
        });
});

router.delete('/:mast',(req,res,next)=>{
    var mast = req.params.mast
    STModel.deleteOne({
        mast : mast
    })
    .then(data=>{
        res.json({message:'Xóa thành công'})
    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Server'})
    })
})

router.get('/:mast',(req,res,next)=>{
    var mast = req.params.mast
    STModel.find({makt : makt})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi server'})
    })

})

module.exports = router