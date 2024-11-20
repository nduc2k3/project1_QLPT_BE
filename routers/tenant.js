const express = require('express');
const router = express.Router();

const TenantModel = require('../models/tenant')
const RoomModel = require('../models/room')

router.get('/',(req,res,next)=>{
    TenantModel.find({})
    .then(data=>{
        res.json(data)

    })
    .catch(err=>{
        res.status(500).json({message:'Lỗi Server'})
    })

})

router.post('/',async (req, res, next) => {
    var makt = req.body.makt
    var tenkt = req.body.tenkt
    var sdt = req.body.sdt
    var email = req.body.email
    var diachitt = req.body.diachitt
    var maphong = req.body.maphong
    var ngaythue = req.body.ngaythue
    var cccd = req.body.cccd
    var ngaycap = req.body.ngaycap
    var ngaysinh = req.body.ngaysinh
    var noisinh = req.body.noisinh
    var tienphong = req.body.tienphong
    var ghichu = req.body.ghichu
    var anh = req.body.anh
    
    // Kiểm tra makt đã tồn tại chưa
    const existingTenant = await TenantModel.findOne({ makt });
    if (existingTenant) {
        return res.status(400).json({ message: 'Mã khách thuê đã tồn tại' });
    }

    // Kiểm tra trạng thái phòng
    const room = await RoomModel.findOne({ maphong });
    if (!room || room.trangthaiphong) {
        return res.status(400).json({ message: 'Phòng không khả dụng hoặc không tồn tại' });
    }


    TenantModel.create({
        makt : makt,
        tenkt : tenkt,
        sdt : sdt,
        email : email,
        diachitt: diachitt,
        maphong : maphong,
        ngaythue : ngaythue,
        cccd : cccd,
        ngaycap : ngaycap,
        ngaysinh : ngaysinh,
        noisinh : noisinh,
        tienphong: tienphong,
        ghichu : ghichu,
        anh : anh

    })
        .then(data => {
            res.json({message:'Thêm khách thuê thành công'})
        })
        .catch(err => {
          return  res.status(500).json({message:'Lỗi Server'})
        })

    await RoomModel.updateOne({ maphong }, { trangthaiphong: true });
})

router.delete('/:makt', async (req, res, next) => {
  const makt = req.params.makt;

  try {
      // Tìm khách thuê theo makt và xóa
      const deleted1Tenant = await TenantModel.findOne({makt});
      const deletedTenant = await TenantModel.deleteOne({ makt });

      if (deletedTenant.deletedCount === 0) {
          return res.status(404).json({ message: 'Không tìm thấy khách thuê để xóa' });
      }

      // Cập nhật trạng thái phòng sau khi xóa thành công khách thuê
      await RoomModel.findOneAndUpdate(
          { maphong: deleted1Tenant.maphong },
          { trangthaiphong: false },
          { new: true }
      );

      res.json({message: 'Xóa khách thuê thành công. Trạng thái phòng đã được cập nhật.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
  }
});



router.put('/:makt',async (req, res, next) => {
    const makt = req.params.makt;

    const updateTenant = await TenantModel.findOne({makt});


    TenantModel.findOneAndUpdate({ makt : makt }, req.body, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).json({message:'Không tìm thấy phòng để cập nhật'});
            }
            res.json({message:'Cập nhật phòng thành công'});
        })
        .catch(err => {
            res.status(500).json({message:'Lỗi server khi cập nhật phòng'});
        });
    await RoomModel.findOneAndUpdate(
        { maphong: updateTenant.maphong },
        { trangthaiphong: false },
        { new: true }
    );

    const update1Tenant = await TenantModel.findOne({makt});
    await RoomModel.findOneAndUpdate(
      { maphong: update1Tenant.maphong },
      { trangthaiphong: true },
      { new: true }
  );
});

router.get('/listdv', async (req, res) => {
    try {
      const result = await TenantModel.aggregate([
        {
          $lookup: {
            from: "room",
            localField: "maphong",  // Khóa ngoại trong "tenant"
            foreignField: "maphong", // Khóa chính trong "room"
            as: "room_info"
          }
        },
        { $unwind: { path: "$room_info", preserveNullAndEmptyArrays: false } }, // Chỉ giữ lại những khách thuê có phòng
  
        {
          $lookup: {
            from: "service_tenant",
            localField: "makt",  // Khóa ngoại trong "tenant"
            foreignField: "makt", // Khóa chính trong "service_tenant"
            as: "service_info"
          }
        },
        { $unwind: { path: "$service_info", preserveNullAndEmptyArrays: false } }, // Chỉ giữ lại những khách thuê có dịch vụ
  
        {
          $lookup: {
            from: "dichvu",
            localField: "service_info.madv",  // Khóa ngoại trong "service_tenant"
            foreignField: "madv", // Khóa chính trong "dichvu"
            as: "dichvu_info"
          }
        },
        { $unwind: { path: "$dichvu_info", preserveNullAndEmptyArrays: false } }, // Chỉ giữ lại những khách thuê có dịch vụ
  
        // Lọc khách thuê có ít nhất 1 dịch vụ
        {
          $match: {
            "service_info": { $ne: [] }  // Lọc những khách thuê có dịch vụ (service_info không được rỗng)
          }
        },
  
        {
          $project: {
            _id : 0,
            tenkt: 1,
            tenphong: "$room_info.tenphong",
            tendv: "$dichvu_info.tendv",
            giatien: "$dichvu_info.giatien",
            soluong: "$service_info.soluong"
          }
        }
      ]);
  
      console.log(result); // Kiểm tra kết quả
      res.json(result);
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });
  
  

module.exports = router