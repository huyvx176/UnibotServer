const express = require('express'), router = express.Router();

const accountController = require('../controllers/web_clients/account')

//account 
router.post('/api/v1/account/create',accountController.create_account);
router.post('/api/v1/account/login',accountController.login);
router.post('/api/v1/account/change_password',accountController.loginRequired, accountController.change_password);
router.post('/api/v1/account/logout',accountController.loginRequired,accountController.logout)

module.exports = router;