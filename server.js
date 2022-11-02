if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bcrypt = require('bcrypt')

// ---------------- Controller ----------------
const Inventaris = require('./controllers/inventarisController')
const Informasi = require('./controllers/informasiController')
const User = require('./controllers/userController')
const Peminjaman = require('./controllers/peminjamanController')

// ---------------- Model ----------------
const AccountDB = require('./models/user')

const app = express()
app.use(session({ secret: 'somevalue' }));

app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost/sistemlab', {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.once('open', async () => {
    if (await AccountDB.countDocuments({ role: true }).exec() > 2) return

    Promise.all([
        AccountDB.create({ username: "Admin1", nis: 111111111, password: await bcrypt.hash("Admin1", 10), role: true}),
        AccountDB.create({ username: "Admin2", nis: 222222222, password: await bcrypt.hash("Admin2", 10), role: true}),
        AccountDB.create({ username: "Admin3", nis: 333333333, password: await bcrypt.hash("Admin3", 10), role: true}),
    ]).then(() => console.log('Admin Added'))
})

app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'));


app.get('/', User.homePage)
// ---------------- Route Inventaris ----------------
app.get('/index/inventaris', Inventaris.getInvetaris)
app.get('/input/inventaris' , User.checkLogin , User.checkAdmin , Inventaris.inputInventaris)
app.post('/insert/inventaris', User.checkLogin , User.checkAdmin ,  Inventaris.insertInventaris)
app.get('/edit/inventaris/:id', User.checkLogin , User.checkAdmin , Inventaris.editInventaris)
app.post('/update/inventaris/:id', User.checkLogin , User.checkAdmin , Inventaris.updateInventaris)
app.post('/remove/inventaris/:id', User.checkLogin , User.checkAdmin , Inventaris.removeInventaris)

// ---------------- Route Informasi ----------------
app.get('/informasi', Informasi.informasi)
app.get('/detail/informasi/:id', Informasi.detailInformasi)
app.get('/index/informasi' ,Informasi.indexInformasi)
app.get('/input/informasi', User.checkLogin , User.checkAdmin , Informasi.inputInformasi)
app.post('/insert/informasi', User.checkLogin , Informasi.insertInformasi)
app.get('/edit/informasi/:id', User.checkLogin, User.checkAdmin, Informasi.editInformasi)
app.post('/update/informasi/:id', User.checkLogin , Informasi.updateInformasi)
app.post('/remove/informasi/:id', User.checkLogin , Informasi.removeInformasi)

// ---------------- Route User ----------------
app.get('/index/user' , User.checkLogin , User.checkAdmin , User.indexUser) // jangan diberi middleware dulu
app.get('/input/user' , User.inputUser , User.checkAdmin) // jangan diberi middleware dulu
app.post('/insert/user' , User.insertUser)
app.get('/edit/user/', User.checkLogin , User.editUser)
app.post('/update/user/:id', User.checkLogin , User.updateUser)
// app.get('/new/password/:id', User.checkLogin , User.newPassword)
// app.post('/update/password/:id', User.checkLogin , User.updatePassword)
app.post('/delete/user/:id', User.checkLogin , User.checkAdmin , User.removeUser)
app.get('/login', User.checkNotLogin , User.loginView)
app.post('/login', User.checkNotLogin , passport.authenticate('local', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
}))
app.delete('/logout', User.checkLogin , User.logout)

// ---------------- Route Peminjaman Lab ----------------
app.get('/history/peminjaman/lab', Peminjaman.historyPeminjamanLab)
app.get('/pengajuan/peminjaman/lab', Peminjaman.pengajuanPeminjamanLab)
app.post('/pengajuan/peminjaman/lab', Peminjaman.insertPengajuanLab)
app.get('/detail/pengajuan/lab/:id', User.checkLogin , User.checkAdmin, Peminjaman.detailsPengajuanLab)
app.post('/pengajuan/lab/accept/:id', User.checkLogin , User.checkAdmin , Peminjaman.acceptPengajuanLab)
app.post('/pengajuan/lab/decline/:id', User.checkLogin , User.checkAdmin , Peminjaman.declinePengajuanLab)
app.post('/remove/history/lab/:id', User.checkLogin , User.checkAdmin , Peminjaman.removePeminjamanLab)
app.post('/remove/pengajuan/lab/:id', User.checkLogin , User.checkAdmin, Peminjaman.removePengajuanLab)

// ---------------- Route Peminjaman Barang ----------------
app.get('/index/pengajuan', User.checkLogin , User.checkAdmin , Peminjaman.indexPengajuan)
// app.get('/pengajuan/peminjaman', Peminjaman.inputPengajuan)
// app.post('/pengajuan/peminjaman', Peminjaman.insertPengajuanLab)

app.get('/pengajuan/peminjaman/barang', User.checkLogin, Peminjaman.pengajuanPeminjamanBarang)
app.post('/pengajuan/peminjaman/barang', User.checkLogin, Peminjaman.insertPengajuanBarang)
app.get('/detail/pengajuan/barang/:id', User.checkLogin , User.checkAdmin, Peminjaman.detailsPengajuanBarang)

app.post('/pengajuan/barang/accept/:id', User.checkLogin , User.checkAdmin , Peminjaman.acceptPengajuanBarang)
app.post('/pengajuan/barang/decline/:id', User.checkLogin , User.checkAdmin , Peminjaman.declinePengajuanBarang)
app.get('/history/peminjaman/barang', Peminjaman.historyPeminjamanBarang)
app.post('/remove/history/barang/:id', User.checkLogin , User.checkAdmin, Peminjaman.removePeminjamanBarang)
app.post('/remove/pengajuan/barang/:id', User.checkLogin , User.checkAdmin, Peminjaman.removePengajuanBarang)
// app.get('/pengajuan/user', User.checkLogin , Peminjaman.pengajuanUser)
// app.get('/index/umum', Peminjaman.indexUmum)
// app.post('/complete/peminjaman/:id', User.checkLogin, User.checkAdmin, Peminjaman.completePeminjaman)


app.listen(5000)