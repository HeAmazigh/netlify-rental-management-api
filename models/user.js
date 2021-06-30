const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs')
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //to use a unique email for evry User in db
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: { type: String, required: [true, "Role obligatoire"] },
    email: { type: String, required: [true, "E-mail obligatoire"], unique: true },
    password: { type: String, required: [true, "Mot de passe obligatoire"], minlength: 6, select: false },
    image: { type: String, required: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, 
{
    timestamps: true
});

userSchema.pre("save", async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getSignedJwtToken = async function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

userSchema.methods.getResetPasswordToken = async function() {
    const resetToken = crypto.randomBytes(20).toString("hex");
      // Hash token (private key) and save to database
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
}

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);