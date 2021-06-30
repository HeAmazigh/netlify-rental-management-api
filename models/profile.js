const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //to use a unique email for evry User in db
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    user_type: { type: String, required: false },
    tenant_type: { type: String, required: false },
    company_type: { type: String, required: false },
    company_name: { type: String, required: false },
    rcs_number: { type: String, required: false },
    civility: { type: String, required: true },
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    birth_day: { type: Date, required: false },
    from_birth: { type: String, required: false },
    phone: { type: String, required: true },
    email: { type: String, required: false },
    address: { type: String, required: true },
    comp_address: { type: String, required: false },
    postal_code: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
}, 
{
    timestamps: true
});

profileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Profile', profileSchema);