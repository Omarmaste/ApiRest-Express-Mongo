function log(res, req, next){
    console.log('Autenticando...')
    next();
}

module.exports = log