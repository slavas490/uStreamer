import express from 'express';

const router = express.Router();

// index
router.get('/', (req, res) => {
	res.redirect('/');
	// res.view('settings');
});

// video devices
router.get('/video', (req, res) => {
	res.view('settings/video', {obj:22});
});

// audio devices
router.get('/audio', (req, res) => {
	res.view('settings');
});


export default router;
