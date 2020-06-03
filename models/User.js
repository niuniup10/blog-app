const bcrypt = require("bcryptjs")
const usersCollection = require('../db').db().collection("users")
const validator = require("validator")

let User = function () {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if (typeof(this.data.username) != "string") {
        this.data.user = ""
    }
    if (typeof(this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof(this.data.password) != "string") {
        this.data.password = ""
    }

    // get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
    
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {
            this.errors.push("You must provide a username")
        }
        if (this.data.user != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("User name can only contain letters and numbers")
        }
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("You must provide a valid email")
        }
        if (this.data.password == "") {
            this.errors.push("You must provide a valid password")
        }
        if (this.data.password.length > 0 && this.data.password.length < 12) {
            this.errors.push("Password must be at least 12 chars")
        }
        if (this.data.password.length > 50) {
            this.errors.push("Password too long 50")
        }
        if (this.data.username.length > 0 && this.data.password.length < 3) {
            this.errors.push("Username must be at least 3 chars")
        }
        if (this.data.username.length > 30) {
            this.errors.push("Username too long 30")
        }
    
        // valid username, check if it is taken
        if (this.data.username > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({username: this.data.username})
            if (usernameExists) {this.errors.push("Username already taken")}
        }
    
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if (emailExists) {this.errors.push("Email already taken")}
        }

        resolve()
    })
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
                this.data = attemptedUser
                this.getAvatar()
                resolve("Congra")
            } else {
                reject("Invalid Username/Password")
            }
        }).catch(function() {
            reject("try again")
        })
    })
}

User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        // validate data
        this.cleanUp()
        await this.validate()
        //no error, then save to database
    
        if (!this.errors.length) {
            // hash userpassword
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

module.exports = User