const router = require('express').Router();

router.post('/', (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + '/chat.html');
});

module.exports = router;
