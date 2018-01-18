var RateLimit = (function(){

    let mongoose = require('mongoose');
    let RateLimitSchema = mongoose.model('RateLimits');
    let RateConfig = require('./RateLimitConfg');
    let SchemaErrors = require('./SchemErrorrs');

    let getRateLimit = function(req, res, next){
        let ip = getIpFromReq(req);
        let ipRateLimit = findIp(ip);
        
        if(!ipRateLimit){
            saveRateLimitForIP(ip);
        }

        if(isIPRateLimitExpired(ipRateLimit)){
            updateRateLimitForIP(ip);
        }

        sendResposneWithRateLimit(req, res, next, rateLimit);
    };


    let getIpFromReq = function(req){
        return req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
    }

    let findRateLimitForIP = function(ip){
        RateLimitSchema.find({ip: ip}, function(rateLimit){
            return rateLimit;
        });
    }
    
    let saveRateLimitForIP = function(ip){
        let rateLimit = new RateLimitSchema({
            ip: ip,
            firstRequestOn: new Date()
        });
        rateLimit.save(function(error) {
            if (error) {
                return SchemaErrors.saveError(req);
            }
        });
    }

    let isIPRateLimitExpired = function(ipRateLimit){
        let dateNow = new Date();
        ipRateLimit.firstRequestOn.setHours(ipRateLimit.firstRequestOn.getHours() + RateConfig.hours);

        if(rateLimit.firstRequestOn < dateNow){
           return true;
        }

        return false;
    }


    let updateRateLimitForIP = function(ip){
        RateLimitSchema.update({
                                    ip: ip, 
                                    $set: [{
                                        firstREquestOn: new Date(),
                                        requests: 1
                                    }]
                                
                                }, function(error, updatedLimit){
                                    if(error){
                                        SchemaErrors.updateError(req);
                                    }
                            });
    }

    let sendResposneWithRateLimit = function(req, res, next, rateLimit) {

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

    return{
        getRateLimit: getRateLimit
    }
})();
