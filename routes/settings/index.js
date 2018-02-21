import express from 'express';

import video from './video';

const router = express.Router();

// index
router.get('/', (req, res) => {
	res.redirect('/');
});

// video devices
router.use('/video', video);

export default router;
