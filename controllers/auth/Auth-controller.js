const crypto = require('crypto');
const HttpError = require('../../errors/http-error');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const sendEmail = require('../../utils/sendEmail');
const User = require('../../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (err) {
        const error = new HttpError('Singup field, plase try again later!',500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('E-mail address already exist!', 422);
        return next(error);
    }

    const createUser = new User({
        role: 'owner',
        email, 
        password,
    });

    try {
        await createUser.save();
    } catch (err) {
        const error = new HttpError('Signing up field, plase try later', 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({
            userId: createUser.id,
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        });      
    } catch (err) {
        const error = new HttpError('Signing up field, plase try later', 500);
        return next(error);
    }
    
    res.status(201).json({ success: true, token: token});
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email}).select("+password");
    } catch (err) {
        const error = new HttpError('Login field, plase try later', 500);
        return next(error);
    }

    if (!existingUser) {
        return next(new HttpError('Credentials not match', 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await existingUser.matchPassword(password);      
    } catch (err) {
        const error = new HttpError('Could not log you in, Please try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        return next(new HttpError('Credentials not match', 403));
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
        },
            process.env.JWT_SECRET,
        {
            expiresIn: '24h'
        })
    } catch (error) {
        return next(new HttpError('logging in failed, Please try agin.', 401));
    }

    res.json({success: true, token: token });
}

exports.forgotPassword = async (req, res, next) => {
    //Send email to email provided but first check if user exists
    const {email} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return next(new HttpError('No email could not be sent.', 404));
    }
    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = existingUser.getResetPasswordToken();
    try {
        await existingUser.save();
    } catch (error) {
        return next(new HttpError('E-mail could not be sent.', 404));
    }

    // Create reset url to email to provided email
    const resetURL = `http://localhosst:3000/passwordreset/${resetToken}`;
    //HTML message
    const message = `
        <h1>Password reset</h1>
        <p>Click this link : <a href=${resetURL} clicktracking=off>ICI</a></p>
    `;
    // try {
    //     await sendEmail({
    //         to: existingUser.email,
    //         subject: "Password Reset",
    //         text: message,
    //     })
    // } catch (error) {
    //     console.log(error);

    //     existingUser.resetPasswordToken = undefined;
    //     existingUser.resetPasswordExpire = undefined;

    //     await existingUser.save();
    //     return next(new HttpError('E-mail could not be sent.', 404));
    // }

    res.status(200).json({ success: true, data: "Email Sent" });
}

exports.resetPassword = async (req, res, next) => {
    // Compare token in URL params to hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest('hex');
    try {
        const user = User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        })
    } catch (error) {
        return next(new HttpError('Reset password field, plase try again later!',500));
    }

    if (!user) {
        return next(new HttpError('Invalid Token',400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    try {
        await user.save();
    } catch (error) {
        return next(new HttpError('Reset password field, plase try again later!',500));
    }

    let token;
    try {
        token = jwt.sign({
            userId: existingUser.id,
        },
            process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        })
    } catch (error) {
        return next(new HttpError('Reset password failed, Please try agin.', 401));
    }

    res.status(201).json({success: true, data: 'Password Updated Success', token: token});
}