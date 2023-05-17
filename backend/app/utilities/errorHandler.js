var message = require('../localization/en.json');
let errorCodes = [400, 422, 429, 409, 404, 500];

module.exports = function (err,req,res, next) {
    try {
        if (!(process.env.NODE_ENV == "production" || process.env.NODE_ENV == "prod")) {
            console.log(err);
        }

        //Note:: In some cases, rejecting with code422, message like in auth in some cases returning the res.status(422)
        //Here we need to check if code exist or not and fix
        // This logic is similar to utils.handleError thing.
        if(err.code && errorCodes.includes(err.code)){
            res.status(err.code).json({
                errors: {
                    msg: err.message
                }
            })               
            return; 
        }

        if (err.code == undefined) {
            err.code = 500;
            err.message = message.apiError;
        }
        
        // Sends error to user
        res.status(500).json({
            "success": false,
            "message": message.apiError
        })
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": message.apiError
        })
    }
    
}