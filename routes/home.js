import express from 'express';
import { dbManager }  from 'db';
import streamServer from 'streamer';

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
	if (video.status == 0) {
		video = video.result;
	}
	if (audio.status == 0) {
		audio = audio.result;
	}

	console.log('treamServer.active', streamServer.active)
	res.view(PAGE_PATH, { videoDevices: video, audioDevices: audio, isActiveStream: streamServer.active});
});

//select device
router.get('/selectDevice', async(req, res) => {
	console.log('selectDevice', req.query)
	let options = req.query,
		deviceId = options.id;
	let result;

	switch(options.type) {
		case 'video':
			let videoDevice = await dbManager.getVideoDevices({id: deviceId});

			result = await dbManager.setActiveVideoDevice(videoDevice.result);

			if (result.status == 0) {
				streamServer.setActiveVideoDevice(videoDevice.result.source);

			}
			break;
		case 'audio':
			let audioDevice = await dbManager.getAudioDevices({id: deviceId});
			result = await dbManager.setActiveAudioDevice(audioDevice);
			if (result.status == 0) {
				streamServer.setActiveAudioDevice(audioDevice.result.path);
			}
			break;
	}

	let video = await getVideoList();
	let audio = await getAudioList();
	if (video.status == 0) {
		video = video.result;
	}
	if (audio.status == 0) {
		audio = audio.result;
	}

	res.view(PAGE_PATH, { videoDevices: video, audioDevices: audio, isActiveStream: streamServer.active});
});

//streaming
router.get('/streaming', (req, res) => {
	let options = req.query,
		command = options.command;

	switch (command) {
		case 'start':
		break;
		case 'stop':
		break;
	}

	return {status: 0, message: 'Трансляция начата'}
});

export default router;
