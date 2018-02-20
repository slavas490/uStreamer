import express from 'express';

import home from './home';
import settings from './settings';

const router = express.Router();

// home page
router.use(home);

// home page
router.use('/settings', settings);

export default router;
