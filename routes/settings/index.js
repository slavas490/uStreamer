import express from 'express';

import video from './video';

const router = express.Router();

/*let DB = new db();
DB.query('SELECT * FROM video')
.then(out => {
	console.log('azazaste', out)
})*/

// index
router.get('/', (req, res) => {
	res.redirect('/');
});

// video devices
router.use('/video', video);

// audio devices
// router.use('/audio', require('./audio'));


export default router;
