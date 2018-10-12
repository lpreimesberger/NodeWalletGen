var express = require('express');
var router = express.Router();
var keythereum = require("keythereum");

/* GET home page. */
router.get('/', function(req, res, next) {
    var PIN = '6969';
    PIN = req.query.PIN;
    if( PIN === undefined) {
        PIN = '';
    }
    var options = {
        kdf: "pbkdf2",
        cipher: "aes-128-ctr",
        kdfparams: {
            c: 262144,
            dklen: 32,
            prf: "hmac-sha256"
        }
    };
    // optional private key and initialization vector sizes in bytes
    var params = { keyBytes: 32, ivBytes: 16 };
    var dk = keythereum.create(params);
    var keyObject = keythereum.dump(PIN, dk.privateKey, dk.salt, dk.iv, options);
   res.send(JSON.stringify(keyObject))

});

module.exports = router;
