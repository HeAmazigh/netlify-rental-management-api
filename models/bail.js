const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //to use a unique email for evry User in db
const Schema = mongoose.Schema;

const bailSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    category: { type: String, required: true },
    type: { type: String, required: true },
    legal_regime: { type: String, required: true },
    destination: { type: String, required: true },
    num_pieces: { type: String, required: true },
    address: { type: String, required: true },
    complement: { type: String, required: false },
    postal_code: { type: Number, required: true },
    city: { type: String, required: true },
    building: { type: String, required: false },
    access_code: { type: Number, required: false },
    staircase: { type: String, required: false },
    floor: { type: Number, required: false },
    num_door: { type: Number, required: false },
    num_keys: { type: Number, required: false },
    infos: {type: Array, require: false},
}, 
{
    timestamps: true
});

bailSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Bail', bailSchema);