const HttpError = require('../../errors/http-error');

const { validationResult } = require('express-validator');

const Bail = require('../../models/bail');
const Bailinfo = require('../../models/bailinfo');
const User = require('../../models/user');

exports.addBail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const bailData = req.body;
    //console.log(bailData);
    const data = new Bail({...bailData, user_id: req.userData.userId});
    //console.log(data);
    try {
        await data.save();
    } catch (err) {
        return next(new HttpError('Save data field, plase try later', 500));
    }
    
    res.status(201).json({success: true, bailId: data.id, user_id: data.user_id});
}

exports.addBailinfo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const bailinfosData = req.body;
    const data = new Bailinfo(bailinfosData);

    try {
        await data.save();
    } catch (err) {
        console.log(err)
        return next(new HttpError('Save data field, plase try later', 500));
    }
    
    res.status(201).json({success: true, bailinfosData: data.id, bail_id: bailinfosData.bail_id});
}

exports.getMyBails = async (req, res, next) => {
    const userID = req.userData.userId;
    
    let existingUser;
    try {
        existingUser = await User.findOne({_id: userID});
    } catch (err) {
        return next(new HttpError('Get bails field, plase try later', 500));
    }
    
    if (!existingUser) {
        return next(new HttpError('User not existe', 403));
    }

    let bails;
    try {
        bails = await Bail.find({user_id: userID});
    } catch (err) {
        return next(new HttpError('Now bails for this User', 500));
    }

    if (!bails || bails.length === 0 ) {
        return next(new HttpError('Now bails for this user', 404));
    }
    
    res.status(201).json({success: true, bails: bails.map(bail => bail.toObject({getters: true})) });
}

exports.getBailById = async (req, res, next) => {
    const bailID = req.params.bailID;
    let bail;
    try {
        bail = await Bail.findById(bailID);
    } catch (err) {
        const error = new HttpError('Non bail with this id', 500);
        return next(error);
    }

    if (!bail) {
        return next(new HttpError('Bail not faond', 404));
    }
    res.json({bail: bail.toObject({getters: true})});
}
// exports.userProfile = async (req, res, next) => {
//     const user_id = req.userData.userId;

//     let userExiste;
//     try {
//         userExiste = await User.findOne({_id: user_id});
//     } catch (err) {
//         return next(new HttpError('User profile field, plase try later', 500));
//     }

//     if (!userExiste) {
//         return next(new HttpError('User not exist!', 422));
//     }

//     let profile;
//     try {
//         profile = await Profile.findOne({user_id}).select(["-user_id","-_id"]);
//     } catch (err) {
//         return next(new HttpError('User profile field, plase try later', 500));
//     }

//     if (!profile) {
//         return next(new HttpError('Veuillez compléter votre profil !', 422));
//     }
//     res.status(201).json({ success: true, profile: profile });
// }
