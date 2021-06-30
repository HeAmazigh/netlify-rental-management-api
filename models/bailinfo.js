const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //to use a unique email for evry User in db
const Schema = mongoose.Schema;

const bailinfosSchema = new Schema({
    bail_id: { type: mongoose.Types.ObjectId, required: true, ref: 'Bail'},
    living_space: { type: String, required: true },
    kitchens: { type: String, required: true },
    num_bedroom: { type: Number, required: true },
    num_bathroom: { type: Number, required: true },
    num_bathroom_2: { type: Number, required: true },
    num_wc: { type: Number, required: true },
    year_construction: { type: String, required: true },
    type_heating: { type: String, required: true },
    hot_water_type: { type: String, required: true },
    cellar: { type: Boolean, required: false },
    parking: { type: Boolean, required: false },
}, 
{
    timestamps: true
});

bailinfosSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Bailinfo', bailinfosSchema);