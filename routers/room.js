const express = require('express');
const router = express.Router();

const RoomModel = require('../models/room')

router.get('/', (req, res, next) => {
    RoomModel.find({})
        .then(data => {
            res.json(data)

        })
        .catch(err => {
            res.status(500).json({message:'Lỗi sever'})
        })

})

router.post('/',async (req, res, next) => {
    var maphong = req.body.maphong
    var tenphong = req.body.tenphong
    var tang = req.body.tang
    var trangthaiphong = req.body.trangthaiphong
    var trangthaitt = req.body.trangthaitt
    var hinhanh = req.body.hinhanh
    var giaphong = req.body.giaphong
    var mota = req.body.mota

    const existingRoom = await RoomModel.findOne({ maphong: maphong });

    if (existingRoom) {
        return res.status(400).json({message:'Mã phòng đã tồn tại.'});
    }

    RoomModel.create({
        maphong: maphong,
        tenphong: tenphong,
        tang: tang,
        trangthaiphong: trangthaiphong,
        trangthaitt: trangthaitt,
        hinhanh: hinhanh,
        giaphong: giaphong,
        mota: mota

    })
        .then(data => {
            res.json({message:'Thêm phòng thành công'})
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi sever'})
        })
})

router.delete('/:maphong', (req, res, next) => {
    const maphong = req.params.maphong;

    RoomModel.deleteOne({
        maphong: maphong
    })
    .then(data => {
        if (data.deletedCount === 0) {
            return res.status(404).json({message:'Không tìm thấy phòng để xóa'});
        }
        res.json({message:'Xóa thành công'});
    })
    .catch(err => {
        res.status(500).json({message:'Lỗi server'});
    });
});

router.put('/:maphong', (req, res, next) => {
    const maphong = req.params.maphong;

    RoomModel.findOneAndUpdate({ maphong: maphong }, req.body, { new: true })
        .then(updatedRoom => {
            if (!updatedRoom) {
                return res.status(404).json({message:'Không tìm thấy phòng để cập nhật'});
            }
            res.json({message:'Cập nhật phòng thành công'});
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi server khi cập nhật phòng'});
        });
});

module.exports = router
