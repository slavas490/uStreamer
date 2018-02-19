import express from 'express';
import view from 'view';

const router = express.Router();

// generate view
router.use(view);

// home page
router.get('/', (req, res) => {
	res.view();
});




// home page
router.get('/settings', (req, res) => {
	res.view('settings');
});

export default router;
