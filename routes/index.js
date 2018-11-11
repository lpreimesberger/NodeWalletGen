var express = require('express');
var router = express.Router();
var keythereum = require("keythereum");
const bip32 = require('bip32');
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const randomwords = require('random-words');

function rng () { return Buffer.from('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz') }

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
    // spongycastle has a serious performance bug - cheat for now
    keyObject.privateKey = dk.privateKey.toString('hex');
   res.send(JSON.stringify(keyObject, null, 2))

});

router.get('/btcwallet', function(req, res, next) {
  var returnValue = {};
  var key = '6969';
  key = req.query.PIN;

  var mnemonic = key;
  if( key == null){
    mnemonic = randomwords() + ' ' + randomwords() + ' ' + randomwords() + ' ' + randomwords() +
      ' ' + randomwords() + ' ' + randomwords() + ' ' + randomwords() + ' ' + randomwords() +
      ' ' + randomwords() + ' ' + randomwords() + ' ' + randomwords() + ' ' + randomwords();
  }
  const seed = bip39.mnemonicToSeed(mnemonic);
  const node = bip32.fromSeed(seed);
  const string = node.toBase58();
  const restored = bip32.fromBase58(string);
  returnValue.xprivHex = node.privateKey.toString('hex');
  returnValue.xpriv = node.privateKey;
  returnValue.xprivBase58 = string;
  returnValue.mnemonic = mnemonic;
  res.send(JSON.stringify(returnValue, null, 2))

});

module.exports = router;
