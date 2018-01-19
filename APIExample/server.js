(function(){
    let express = require('express'),
        app = express(),
        port = process.env.PORT || 3000,
        mongoose = require('mongoose'),
        AutoNumber = require("./AutoIncrrementalSchema"),
        Burger = require('./API/models/BurgerModel/BurgerModel'), 
        RateSchema = require("./API/RateLimit/RateLimitModel/RateLimitSchema"),
        RateLimit = require("./API/RateLimit/RateLimit");
        ParamValidator = require("./ParamValidator");
        bodyParser = require('body-parser');
    



    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/BurgerApiDB'); 


    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(function(req, res, next){ RateLimit.get(req, res, next); });
    app.use(function(req, res, next){ ParamValidator.checkForWrongParams(req.query, res, next); });
    app.use(function(req, res, next){ ParamValidator.checkForEmptyParam(req.query, res, next); });

    var routes = require('./API/routes/BurgerRoutes'); 
    routes(app);

    app.listen(port);

    console.log("Server started...");
})();
