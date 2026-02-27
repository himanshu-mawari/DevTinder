const errorhandler = (statuscode , message) => {
    const error = new Error(message);
    error.statusCode = statuscode;
    return error
}

module.exports = errorhandler;