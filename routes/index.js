import express from 'express';

import home from './home';
import settings from './settings';

const router = express.Router();

router.use((req, res, next) => {
	console.dir(req.path)
	next();
})

// home page
router.use(home);

// settings page
router.use('/settings', settings);

export default router;
