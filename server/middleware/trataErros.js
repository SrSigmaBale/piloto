async function trataErros(err ,req, res, next) {
    let statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    console.error(err.message);

    res.status(statusCode).json({
        status: statusCode,
        message: message
    });
}

module.exports = trataErros