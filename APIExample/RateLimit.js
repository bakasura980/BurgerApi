var RateLimit = require('./RateLimitSchema');
var RateConfig = require('./RateLimitConfg');

function RateLimitController(req, res, next){
    
    let ip = getIpFromReq(req);

    let getIpFromReq = function(req){
        return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    }

    let //...


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

            if(rateLimit.firstRequestOn < dateNow){
                rateLimit.update({ip: ip, $set: [{
                    firstREquestOn: new Date(),
                    requests: 1
                }]}, function(error, updatedLimit){
                    //...???
                });
            }

            sendResposneWithRateLimit(req, res, next, rateLimit);
        });

    function sendResposneWithRateLimit(req, res, next, rateLimit) {

        //req.rateLimit = rateLimit; ???
        if(isRateRequestsReached()){
            res = addRateLimitHeaderToResponse(res);
            return next();
        } else {
            sendRateLimitReachedResponse(res);
        }
    }

    let isRateRequestsReached = function(){
        return rateLimit.requests < RateConfig.maxRequests;
    }

    let addRateLimitHeaderToResponse = function(res){
        res.set('x-rateLimit-limit', RateConfig.maxRequests);
        res.set('x-ratelimit-remaining', RateConfig.maxRequests - rateLimit.requests);

        return res;
    }

    let sendRateLimitReachedResponse = function(res){
        res.statusCode = 429;
        return res.json({
            errors: [
                { message: 'Rate limit reached. Please wait and try again.' }
            ]
        });
    }
}
