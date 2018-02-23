import express from 'express';
import { dbManager }  from 'db';

const router = express.Router();

let PAGE_PATH = 'home';

const getVideoList = async () => {
	return await dbManager.getVideoDevices({ order: { type: 'DESC' }});
};

const getAudioList = async () => {
	return await dbManager.getAudioDevices({ order: { type: 'DESC' }});
};

// index
router.get('/', async(req, res) => {
	let video = await getVideoList();
	let audio = await getAudioList();
	res.view(PAGE_PATH, { videoDevices: video.result, audioDevices: audio.result });
});

export default router;
