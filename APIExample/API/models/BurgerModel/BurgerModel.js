let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BurgerSchema = new Schema({
    name:{
        type: String
    },
    description:{
        type: String
    },
    size:{
        type: String,
        enum: ['Small', 'Medium', 'Big']
    },
    image_url:{
        type: String
    },
    created_on:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Burgers', BurgerSchema);