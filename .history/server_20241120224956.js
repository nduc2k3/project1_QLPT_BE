const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())


// quan li tai khoan
const accRouter = require('./routers/acc')
app.use('/api/acc/',accRouter)

//quan li phong tro
const roomRouter = require('./routers/room')
app.use('/api/room/',roomRouter)

//quan li khach thue
const tenantRouter = require('./routers/tenant')
app.use('/api/tenant/',tenantRouter)

//quan li dien nuoc
const DnRouter = require('./routers/diennuoc')
app.use('/api/diennuoc/',DnRouter)

//quan li dich vu
const DvRouter = require('./routers/dichvu')
app.use('/api/dichvu/',DvRouter)

//quan li dich vu khach thue
const STRouter = require('./routers/service_tenant')
app.use('/api/dv_kt/',STRouter)

//quan li dich vu thanh vien
const TvRouter = require('./routers/thanhvien')
app.use('/api/thanhvien/',TvRouter)

const TestRouter = require('./routers/thongtinkhachthue')
app.use('/api/ttkt/',TestRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port `);
});