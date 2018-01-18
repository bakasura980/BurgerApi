var RateLimit = require('./RateLimitSchema');
var RateConfig = require('./RateLimitConfg');

function RateLimit(req, res, next){
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    RateLimit
        .find({ip: ip}, function(error, rateLimit){
            if(error){
                res.statusCode = 500;
                return next(error);
            }else if(!rateLimit){
                rateLimit = new RateLimit({
                    ip: ip,
                    firstRequestOn: new Date()
                });
                rateLimit.save(function(error, rateLimit) {
                    if (error) {
                        res.statusCode = 500;
                        return next(error);
                    } else if (!rateLimit) {
                        res.statusCode = 500;
                        return res.json({
                            errors: [
                                {message: 'Error checking rate limit'}
                            ]
                        });
                    }
                });
            }

            let dateNow = new Date();
            rateLimit.firstRequestOn.setHours(rateLimit.firstRequestOn.getHours() + RateConfig.hours);

            if(rateLimit < dateNow){
                //update firstREquestOn
            }
            //..
        });
            { $inc: { requests: 1 } },
            { upsert: false })
        .exec(function(error, rateLimit) {
            if (error) {
                res.statusCode = 500;
                return next(error);
            } else if (!rateLimit) {
                rateLimit = new RateLimit({
                    ip: ip,
                    firstRequestOn: new Date()
                });
                rateLimit.save(function(error, rateLimit) {
                    if (error) {
                        res.statusCode = 500;
                        return next(error);
                    } else if (!rateLimit) {
                        res.statusCode = 500;
                        return res.json({
                            errors: [
                                {message: 'Error checking rate limit'}
                            ]
                        });
                    }

                    respondWithThrottle(req, res, next, rateLimit);
                });
            } else {
                respondWithThrottle(req, res, next, rateLimit);
            }
        });

    function respondWithThrottle(req, res, next, rateLimit) {

        res.set('x-rateLimit-limit', RateConfig.maxRequests);
        res.set('x-ratelimit-remaining', RateConfig.maxRequests - rateLimit.requests);
        req.rateLimit = rateLimit;
        if (rateLimit.requests < RateConfig.maxRequests) {
            return next();
        } else {
            res.statusCode = 429;
            return res.json({
                errors: [
                    {message: 'Rate Limit reached. Please wait and try again.'}
                ]
            });
        }
    }
}