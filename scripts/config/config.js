require('dotenv').config();

var CONFIG = {};
CONFIG.JWT = {
    SECRET: 'TEST_SECRET'
}
CONFIG.MODE = 'DEV';
CONFIG.PROD_MODE = CONFIG.MODE === 'DEV' ? false: true;
CONFIG.IS_CERT_AUTH_ENABLED = false;
CONFIG.CURRENCY= process.env.CURRENCY_LABEL;
CONFIG.TEST_GATEWAY = {
    BASEURL: process.env.TEST_GATEWAY_URL,
    API_VERSION: process.env.API_VERSION,
    USERNAME: 'merchant.' + process.env.USERNAME,
    PASSWORD: process.env.PASSWORD ,
    MERCHANTID: process.env.USERNAME
};
CONFIG.PKI_GATEWAY = {
    BASEURL: process.env.BASEURL ,
    API_VERSION: process.env.API_VERSION,
    MERCHANTID:process.env.USERNAME
}
CONFIG.WEBHOOKS = {
    WEBHOOKS_NOTIFICATION_SECRET : process.env.WEBHOOKS_NOTIFICATION_SECRET,
    WEBHOOKS_NOTIFICATION_FOLDER : 'webhooks-notifications'
}
CONFIG.SSL_FILES = {
    CRT: process.env.SSL_CRT_PATH,
    KEY: process.env.SSL_KEY_PATH
}
module.exports = CONFIG;