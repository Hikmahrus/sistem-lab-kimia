const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt') 

function initializePassport(passport, getUser, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUser(username)
        if (user == null) {
            console.log("no user found")
            return done(null, false, { message: "No user found"})
        }

        try {
           if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
           } else {
                return done(null, false, { message: "Password incorrect"})
           } 
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new localStrategy({usernameField: 'username', passwordField: 'password'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initializePassport