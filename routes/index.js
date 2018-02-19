import express from 'express';

const router = express.Router();

// home page
router.get('/', (req, res) => {
	res.view();
});


// home page
router.get('/settings', (req, res) => {
	res.view('settings');
});

export default router;
