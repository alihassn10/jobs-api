const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs')
const jsonwebtoken= require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide name'],
        minLength: 3,
        maxLength: 40
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'],
        unique: true

    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minLength: 6,

    }
})

userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.createJWT=function(){
    return jsonwebtoken.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME })
}
userSchema.methods.comparePassword=async function(credidentialsPassword){
const isMatch=await bcrypt.compare(credidentialsPassword,this.password)
return isMatch
}

module.exports = mongoose.model('user', userSchema)