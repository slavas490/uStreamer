import express from 'express';

import video from './video';
import audio from './audio';
import general from './general';

const router = express.Router();

// index
router.get('/', (req, res) => {
	res.redirect('/');
});

// video devices
router.use('/video', video);

// audio devices
router.use('/audio', audio);

// general settings
router.use('/general', general);

export default router;
