const express = require('express');
const router = express.Router();

router.get('/inicio', (req, res) => {
    res.render('inicio');
});

module.exports = router;