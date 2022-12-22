const Inventaris = require('../models/inventaris')

const getInvetaris = async (req, res) => {
    const user = await req.user

    const page = parseInt(req.query.page)
    const limit = 10 

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const result = {}

    if (endIndex < await Inventaris.countDocuments().exec()) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        result.result = await Inventaris.find().limit(limit).skip(startIndex).exec()
    } catch (error) {
        console.log(error)
    }

    res.render('../views/inventaris/indexInventaris', {data: result, admin: (user != null)? user.role : 0, user: user})
}

const inputInventaris = async (req, res) => {
    const user = await req.user 
    res.render('../views/inventaris/inputInventaris', {user: user})
}

const insertInventaris = async (req, res) => {
    const data = new Inventaris({
        nama: req.body.nama,
        jumlah: req.body.jumlah,
        kondisi: req.body.kondisi
    })
    try {
        await data.save()
        res.redirect('/input/inventaris')
    } catch (error) {
        console.log(error)
    }
}

const editInventaris = async (req, res) => {
    const data = await Inventaris.findById(req.params.id)
    const user = await req.user
    res.render('../views/inventaris/editInventaris', {data: data, user: user})
}

const updateInventaris = async (req, res) => {
    const data = await Inventaris.findById(req.params.id)
    data.nama = req.body.nama
    data.jumlah = req.body.jumlah
    data.kondisi = req.body.kondisi
    try {
        await data.save()
        res.redirect('/index/inventaris?page=1')
    } catch (error) {
        console.log(error)
    }
}

const removeInventaris = async (req, res) => {
    await Inventaris.findByIdAndDelete(req.params.id)
    res.redirect('/index/inventaris/?page=1')
}

module.exports = {
    getInvetaris,
    inputInventaris,
    insertInventaris,
    editInventaris,
    updateInventaris,
    removeInventaris,
}