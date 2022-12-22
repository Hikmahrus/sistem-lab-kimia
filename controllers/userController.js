const Informasi = require('../models/informasi')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('../passport-config')

initializePassport(
    passport,
    username => User.findOne({ username: username }),
    id => User.findById(id)
)

const homePage = async (req, res) => {
    const data = await Informasi.find().sort({createAt: 'desc'}).limit(4)
    const user = await req.user
    console.log(user)
    res.render('../views/homePage', {user: user, admin: (user != undefined)? user.role : false ,data: data})
}

const indexUser = async (req, res) => {
    const user = await req.user

    const page = parseInt(req.query.page)
    const limit = 10 

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const result = {}

    if (endIndex < await User.countDocuments({ role: false}).exec()) {
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
        result.result = await User.find({ role: false }).limit(limit).skip(startIndex).exec()
    } catch (error) {
        console.log(error)
    }

    res.render('../views/user/user', {data: result, user: user})
}

const inputUser = async (req, res) => {
    const user = await req.user
    res.render('../views/user/inputUser', {user: user, message: undefined})
}

const insertUser = async (req, res) => {
    const user = await req.user
    const data = new User({
        username: req.body.username,
        nis: req.body.nis,
        password: await bcrypt.hash(req.body.password, 10),
        role: 0,
    })
    try {
        await data.save()
        res.redirect('/input/user')
    } catch (error) {
        res.render('../views/user/inputUser', {user: user, message: error})
    }
}

const editUser = async( req, res) => {
    const user = await req.user
    res.render('../views/user/editaccount', {user: user})
}

const updateUser = async (req, res) => {
    const data = await User.findById(req.params.id)
    data.username = req.body.username
    data.nis = req.body.nis
    data.password = (req.body.password == "") ? data.password : await bcrypt.hash(req.body.password, 10)
    try {
        await data.save()
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}

const removeUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.redirect('/index/user?page=1')
}

const loginView = (req, res) => {
    res.render('../views/login/loginPage', {user: undefined})
}

const logout = (req, res) => {
    console.log('logout')
    req.logout(function(err) {
        res.redirect('/')
    })
}

function checkLogin(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotLogin(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

async function checkAdmin(req, res, next) {
    const user = await req.user.clone()
    if (await user.role == 1) {
        return next()
    }
    res.redirect('/')
}

module.exports = {
    homePage,
    indexUser,
    inputUser,
    insertUser,
    editUser,
    updateUser,
    removeUser,
    loginView,
    logout,
    checkLogin,
    checkNotLogin,
    checkAdmin,
}