let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let AutoIncrement = new Schema({
    name:{
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        required: true,
        default: 1
    }
});

module.exports = mongoose.model("AutoIncrement", AutoIncrement);