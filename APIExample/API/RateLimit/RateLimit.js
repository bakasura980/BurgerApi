var RateLimit = (function(){

    let mongoose = require('mongoose');
    let RateLimitSchema = mongoose.model('RateLimits');
    let RateConfig = require('./config/RateLimitConfg');

    let get = function(req, res, next){
        let ip = getIpFromReq(req);
        
        findRateLimitForIP(ip).then((ipRateLimit) => {
            if(!ipRateLimit){
                saveRateLimitForIP(ip).then((createdRateLimit) => {
                    addRateLimitToResponse(req, res, next, createdRateLimit);
                });
            }else if(isIPRateLimitExpired(ipRateLimit)){
                clearRateLimitRequests(ip).then((rateLimit) => {
                    addRateLimitToResponse(req, res, next, rateLimit);
                });
            }else{
                incRequestsForIP(ip).then((updatedRateLimit) => {
                    addRateLimitToResponse(req, res, next, updatedRateLimit);
                });
            }
        });
    };


    let getIpFromReq = function(req){
        return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    }

    let findRateLimitForIP = function(ip){
        return RateLimitSchema.findOne({ip: ip}); 
    }
    
    let saveRateLimitForIP = function(ip){
        let rateLimit = new RateLimitSchema({
            ip: ip,
            firstRequestOn: new Date()
        });
        return rateLimit.save();
    }

    let isIPRateLimitExpired = function(ipRateLimit){
        let dateNow = new Date();
        ipRateLimit.firstRequestOn.setHours(ipRateLimit.firstRequestOn.getHours() + RateConfig.hours);

        if(ipRateLimit.firstRequestOn < dateNow){
           return true;
        }

        return false;
    }

    let clearRateLimitRequests = function(ip){
        return RateLimitSchema.findOneAndUpdate({
                                    ip: ip, 
                                    $set: {
                                        firstRequestOn: new Date(),
                                        requests: 1
                                    }
                            });
    }

    let incRequestsForIP = function(ip){
        return RateLimitSchema.findOneAndUpdate({
                                    ip: ip, 
                                    $inc: {
                                        requests: 1
                                    }
                            });
    }

    let addRateLimitToResponse = function(req, res, next, rateLimit) {
        if(isRateRequestsReached(rateLimit)){ 
            sendRateLimitReachedResponse(res);
        } else {
            res = addRateLimitHeaderToResponse(res, rateLimit);
            return next();
        }
    }

    let isRateRequestsReached = function(rateLimit){
        return rateLimit.requests > RateConfig.maxRequests;
    }

    let addRateLimitHeaderToResponse = function(res, rateLimit){
        res.setHeader('x-rateLimit-limit', RateConfig.maxRequests);
        res.setHeader('x-ratelimit-remaining', RateConfig.maxRequests - rateLimit.requests);

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

    return{
        get: get
    }
})();

module.exports = RateLimit;