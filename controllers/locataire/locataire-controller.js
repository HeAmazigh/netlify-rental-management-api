const HttpError = require('../../errors/http-error');

const { validationResult } = require('express-validator');

const Profile = require('../../models/profile');
const User = require('../../models/user');

exports.addLocataire = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return next(new HttpError('Invalid inputs', 422));
    // }
    const {user_type,company_type,company_name,rcs_number,civility,last_name,first_name, password, birth_day, from_birth, phone,email,address,comp_address,postal_code,city,country} = req.body;
    
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
        role: 'tenant',
        email, 
        password,
    });
    
    try {
        await createUser.save();
    } catch (err) {
        const error = new HttpError('Signing up field, plase try later', 500);
        return next(error);
    }
    
    const profileInfo = new Profile({
        user_id: createUser._id,
        user_type,
        company_type,
        company_name,
        rcs_number,
        civility,
        last_name,
        first_name,
        birth_day,
        from_birth,
        phone,
        address,
        comp_address,
        postal_code,
        city,
        country,
    });
    
    try {
        await profileInfo.save();
    } catch (err) {
        return next(new HttpError('Save data field, plase try later', 500));
    }
    
    res.status(201).json({success: true, profileId: profileInfo.id, user_id: profileInfo.user_id});
}
