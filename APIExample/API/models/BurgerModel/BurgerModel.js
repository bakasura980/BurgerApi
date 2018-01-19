var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AutoIncrement = mongoose.model('AutoIncrement');

let BurgerSchema = new Schema({
    id:{
        type: Number,
        required: true,
        default: 1
    },
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

BurgerSchema.pre('save', function(next) {
    let burger = this;
    AutoIncrement.findOneAndUpdate({  name: "burger" }, { $inc: { seq: 1}  }, 
        function(error, autoIncrement){
            if(error){
                return next(error);
            }else if(!autoIncrement){
                save().then((autoIncrement) => {
                    burger.id = autoIncrement.seq;
                    return next();
                });
            }else{
                burger.id = autoIncrement.seq + 1;
                next();
            }
    });

    let save = function (){
        let autoIncrement = new AutoIncrement({
            name: "burger",
            seq: 1
        });
        return autoIncrement.save();
    }
});

module.exports = mongoose.model('Burgers', BurgerSchema);