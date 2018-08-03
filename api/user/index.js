const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.get('/', ctrl.index);

router.get('/:id', ctrl.show);

// delete에 대한 라우팅 로직이 없다 .
router.delete('/:id', ctrl.destroy);

router.post('/', ctrl.create);

router.put('/:id', ctrl.update);

module.exports = router;