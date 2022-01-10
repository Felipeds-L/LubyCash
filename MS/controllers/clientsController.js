const { Client } = require('../models')
const {Router} = require('express')

const router = Router();

router.get('/', async (req, res) => {
  return res.status(200).json({Message: 'The access its working'})
})

module.exports = router;