let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RateLimitSchema = new Schema({
    ip:{
        type: String,
        required: true,
    },
    requests:{
        type: Number,
        required: true,
        default: 1
    },
    firstRequestOn:{
      type: Date,
      required: true,
      default: Date.now()
    }
});

module.exports = mongoose.model('RateLimits', RateLimitSchema);