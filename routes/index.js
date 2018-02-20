import express from 'express';

import home from './home';
import settings from './settings';

const router = express.Router();

router.use((req, res, next) => {
	console.dir(req.path)
	next();
})

//<<<<<<< HEAD
// settings
router.get('/settings/video', (req, res) => {
	res.view('settings/video');
});

router.get('/settings/audio', (req, res) => {
	res.view('settings/audio');
});
// =======
// home page
router.use(home);

// settings page
router.use('/settings', settings);
// >>>>>>> 06e8b12394f29100ef6a7f1f1f8367cec678044c

export default router;
