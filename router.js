const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message:'hola que hace amigo',
  });
});


module.exports = router;