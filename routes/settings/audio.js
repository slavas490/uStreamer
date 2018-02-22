import express from 'express';
import devicesManager from 'devices';
const router = express.Router();

let PAGE_PATH = 'settings/audio';

let devManager = new devicesManager();

router.get('/', async (req, res) => {
	console.log('AUDIO PAGE')
	res.view(PAGE_PATH);
});

export default router;