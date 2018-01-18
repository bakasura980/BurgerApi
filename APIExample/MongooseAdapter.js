function SchemaAdapter(){
    let mongoose = require('mongoose');
    
    let Schema = mongoose.Schema;

    this.find = function(){
        return Schema.find();
    }

    this.update = function(){
        return Schema.update();
    }
};
