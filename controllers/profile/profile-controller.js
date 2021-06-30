const HttpError = require('../../errors/http-error');

const { validationResult } = require('express-validator');

const Profile = require('../../models/profile');
const User = require('../../models/user');

exports.profinInfo = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    let userProfile;
    try {
        userProfile = await Profile.findOne({user_id: req.userData.userId});
    } catch (err) {
        return next(new HttpError('Add profile information field, plase try again later!',500));
    }

    if (userProfile) {
        return next(new HttpError('User already have profile informations!', 403));
    }

    //const {user_type,company_type,company_name,rcs_number,civility,last_name,first_name, birth_day, from_birth, phone,email,address,comp_address,postal_code,city,country} = req.body;
    const data = req.body;
    const profileInfo = new Profile({...data, user_id: req.userData.userId});
    //return console.log(profileInfo);

    try {
        await profileInfo.save();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Save data field, plase try later', 500));
    }
    
    res.status(201).json({success: true, profileId: profileInfo.id, user_id: profileInfo.user_id});
}

exports.userProfile = async (req, res, next) => {
    const user_id = req.userData.userId;

    let userExiste;
    try {
        userExiste = await User.findOne({_id: user_id});
    } catch (err) {
        return next(new HttpError('User profile field, plase try later', 500));
    }

    if (!userExiste) {
        return next(new HttpError('User not exist!', 422));
    }

    let profile;
    try {
        profile = await Profile.findOne({user_id}).select(["-user_id","-_id"]);
    } catch (err) {
        return next(new HttpError('User profile field, plase try later', 500));
    }

    if (!profile) {
        return next(new HttpError('Veuillez compléter votre profil !', 422));
    }
    res.status(201).json({ success: true, profile: profile });
}
