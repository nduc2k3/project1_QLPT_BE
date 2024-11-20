const express = require('express');
const router = express.Router();
const TenantModel = require('../models/tenant');
const DiennuocModel = require('../models/diennuoc');
const STModel = require('../models/service_tenant');
const DvModel = require('../models/dichvu')

router.get('/tongtien', async (req, res) => {
    try {
        const { tenphong, tang, thang, nam } = req.query;

        let query = {};

        if (tenphong) {
            query["tenphong"] = tenphong;
        }
        if (tang) {
            query["tang"] = parseInt(tang);
        }

        if (thang) {
            query["thang"] = parseInt(thang); // Chuyển tháng sang kiểu số
        }

        if (nam) {
            query["nam"] = parseInt(nam); // Chuyển tháng sang kiểu số
        }

        if (thang & nam) {
            query["thang"] = parseInt(thang);
            query["nam"] = parseInt(nam);
        }


        const dienNuocResults = await DiennuocModel.aggregate([
            {
                $lookup: {
                    from: "tenant",
                    localField: "makt",
                    foreignField: "makt",
                    as: "tenant_info"
                }
            },
            {
                $unwind: "$tenant_info"
            },
            {
                $lookup: {
                    from: "room",
                    localField: "tenant_info.maphong",
                    foreignField: "maphong",
                    as: "room_info"
                }
            },
            {
                $project: {
                    makt: 1,
                    tenkt: "$tenant_info.tenkt",
                    ngaysinh : "$tenant_info.ngaysinh",
                    cccd : "$tenant_info.cccd",
                    sdt : "$tenant_info.sdt",
                    thang: "$thang", // Thêm trường tháng
                    nam: "$nam", // Thêm trường năm
                    tenphong : {$arrayElemAt: ["$room_info.tenphong", 0] },
                    tang: { $arrayElemAt: ["$room_info.tang", 0] }, 
                    tienphong : "$tenant_info.tienphong",
                    tiendien:{$multiply: ["$sodien", "$giadien"]},
                    tiennuoc:{$multiply: ["$sonuoc", "$gianuoc"]},
                    tongtien_dn: {
                        $add: [
                            "$tenant_info.tienphong",
                            { $multiply: ["$sodien", "$giadien"] },
                            { $multiply: ["$sonuoc", "$gianuoc"] }
                        ]
                    }
                }
            },
            {
                $match: query
            },
            {
                $sort: { nam: -1, thang: -1 }
            }
        ]);

        const dvResults = await TenantModel.find({});

        const result = [];

        for (let i = 0; i < dienNuocResults.length; i++) {
            let tiendv = 0;
            let totalCost = dienNuocResults[i].tongtien_dn;

            const services = await STModel.find({ makt: dienNuocResults[i].makt });

            for (const service of services) {
                const dv = await DvModel.findOne({ madv: service.madv });
                tiendv += service.soluong * dv.giatien;
                totalCost += service.soluong * dv.giatien;
            }

            result.push({
                makt : dienNuocResults[i].makt,
                tenkt: dienNuocResults[i].tenkt,
                thang: dienNuocResults[i].thang,
                nam: dienNuocResults[i].nam,
                tenphong : dienNuocResults[i].tenphong,
                tang: dienNuocResults[i].tang,
                tiendien : dienNuocResults[i].tiendien,
                tiennuoc : dienNuocResults[i].tiennuoc,
                tienphong : dienNuocResults[i].tienphong,
                tiendv : tiendv,
                tongtien: totalCost
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/danhsach', async (req, res) => {

    try {
        const { tenphong, tang, thang, nam } = req.query;

        let query = {};

        if (tenphong) {
            query["tenphong"] = tenphong;
        }
        if (tang) {
            query["tang"] = parseInt(tang);
        }

        if (thang && nam) {
            const startDate = new Date(nam, thang - 1, 1);
            const endDate = new Date(nam, thang, 0, 23, 59, 59);
            query["ngaythue"] = { $gte: startDate, $lte: endDate };
        }

        const results = await TenantModel.aggregate([
            {
                $lookup: {
                    from: "room",
                    localField: "maphong",
                    foreignField: "maphong",
                    as: "room_info"
                }
            },
            {
                $unwind: "$room_info"
            },
            {
                $project: {
                    makt: 1,
                    tenkt: 1,
                    ngaysinh: 1,
                    cccd: 1,
                    sdt: 1,
                    tenphong: "$room_info.tenphong",
                    tang: "$room_info.tang",
                    ngaythue: 1,
                    tienphong: "$tienphong",
                    _id: 0
                }
            },
            {
                $match: query
            },
            {
                $sort: { makt:1 }
            }
        ]);

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
            makt:1,
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



module.exports = router;