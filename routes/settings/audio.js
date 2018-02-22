import express from 'express';
import { dbManager }  from 'db';
import devicesManager from 'devices';

const router = express.Router();
let PAGE_PATH = 'settings/audio';
let devManager = new devicesManager();

const getAudioList = async () => {
	return await dbManager.getAudioDevices({ order: { type: 'DESC' }});
};

router.get('/', async (req, res) => {
	let list = await getAudioList();
	let mediaDevices = await devManager.getMediaDevices();
	res.view(PAGE_PATH, { result: list.result, audioDevices: mediaDevices.audio });
});

// create new audio device
router.post('/', async (req, res) => {
	let form = req.body;
	console.log('FULLNAME', form.fullname);
	let fullname = form.fullname.split('    '),
		name = fullname[0].trim(),
		path = fullname[1].trim().replace('(', '').replace(')','');

	console.log('name', name);
	console.log('path', path);

	let out = await dbManager.createAudioDevice(name, path);
	let list = await getAudioList();
	let mediaDevices = await devManager.getMediaDevices();

	console.log('list', list);

	if (out.status == 0) {
		res.view(PAGE_PATH, { status: 0, result: list.result, success: 'Успешно добавлено', audioDevices: mediaDevices.audio  });
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result, audioDevices: mediaDevices.audio   });
	}
});

// remove audio device
router.get('/:id', async (req, res) => {
	let out = await dbManager.removeAudioDevice(req.params.id);
	let list = await getAudioList();
	let mediaDevices = await devManager.getMediaDevices();
	if (out.status == 0) {
		res.view('/' + PAGE_PATH, { status: 0, result: list.result, success: 'Успешно удалено', audioDevices: mediaDevices.audio });
	}
	else {
		res.view('/' + PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result,audioDevices: mediaDevices.audio});
	}
});
export default router;