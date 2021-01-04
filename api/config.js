// Server configuration
const config = {
    API_DEV_MODE: true, // Determines which database configuration is used
    API_DEV_PROXY: true,
    API_SAFE_MODE: false, // In safe mode admin endpoints are disabled
    API_DEBUG_MESSAGES: true, // If enabled will display debug messages in the comman-line interface
    API_SECURITY_MESSAGES: true, // If enabled will display security messages in the command-line interface
    API_PORT: 8080,
    API_ADMIN_KEY: 'ierthgerwr8350hdadjfskrj219ogdf239ahr26394rauyrqwhr254djhy46324iajkoqw0bg',
    DB_ADDRESS_DEV: 'mongodb://127.0.0.1:27017/jobbler-dev',
    DB_ADDRESS_PROD: 'mongodb://127.0.0.1:27017/jobbler-prod',
    DB_ADDRESS_TESTS: 'mongodb://127.0.0.1:27017/jobbler-tests'
    //DB_ADDRESS_PROD: 'mongodb://jobbler:password@localhost:27017?authMechanism=DEFAULT&authSource=db&tls=true'
}

module.exports = config;