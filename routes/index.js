var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});
var tokenApp = require('../services/tokenApp')


router.get('/', async function (req, res, next) {
  var primaryAccountTokens = await tokenApp.getBalanceOf(tokenApp.primaryAccount);
  res.render('index', {
    primaryAccountTokens,
    'primaryAccount': tokenApp.primaryAccount
  });
});

router.post('/upload', upload.single('txFile'), async function (req, res, next) {
  // console.log(req);
  await tokenApp.extractFile(req.file.path, async (txArray) => {
    res.send(
      txArray
    );
  });
  // res.redirect('/');
});

module.exports = router;
