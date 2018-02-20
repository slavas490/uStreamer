import express from 'express';

const router = express.Router();

// home page
router.get('/', (req, res) => {
	res.view();
});


// settings
router.get('/settings/video', (req, res) => {
	res.view('settings/video');
});

router.get('/settings/audio', (req, res) => {
	res.view('settings/audio');
});

export default router;
