const error = (error, req, res, next) => {
    return res.status(error.statusCode).json({
        result: 'error',
        message: error.message
    }) 
}
module.exports = error;