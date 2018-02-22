import express from 'express';
import { dbManager }  from 'db';

const router = express.Router();

let PAGE_PATH = 'settings/video';

const getVideoList = async () => {
	return await dbManager.getVideoDevices({ order: { type: 'DESC' }});
};

router.get('/', async (req, res) => {
	let out = await getVideoList();
	res.view(PAGE_PATH, { result: out.result });
});

// create new video device
router.post('/', async (req, res) => {
	let form = req.body;

	if(!form || !form.name || !form.url) {
		let list = await getVideoList();
		return res.view(PAGE_PATH, { status: 1, error: 'Необходимо заполнить все поля!', result: list.result });
	}

	let out = await dbManager.createVideoDevice(form.name, form.url);

	if (out.status == 0) {
		let list = await getVideoList();
		res.view(PAGE_PATH, { status: 0, result: list.result, success: 'Успешно добавлено' });
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result  });
	}
});

// remove video device
router.get('/remove/:id', async (req, res) => {
	let out = await dbManager.removeVideoDevice(req.params.id);
	let list = await getVideoList();
	if (out.status == 0) {
		res.view('/' + PAGE_PATH, { status: 0, result: list.result, success: 'Успешно удалено' });
	}
	else {
		res.view('/' + PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result, });
	}
});

// update video device
router.get('/:id', async (req, res) => {
	let list = await getVideoList();
	let video = (await dbManager.getVideoDevices({id: req.params.id})).result;
	res.view(PAGE_PATH, { updateVideo: video, result: list.result});
});

router.post('/update/:id', async (req, res) => {
	let form = req.body;
	let video = (await dbManager.getVideoDevices({id: req.params.id})).result;

	if(!form || !form.name || !form.url) {
		let list = await getVideoList();
		return res.view('/' + PAGE_PATH,  { status: 1, error: 'Необходимо заполнить все поля!', result: list.result, updateVideo: video, });
	}

	let out = await dbManager.updateVideoDevice(req.params.id, form.name, form.url);
	let list = await getVideoList();
	if (out.status == 0) {
		res.view('/' + PAGE_PATH, {status: 0, success: 'Успешно изменено', result: list.result}); 
	}
	else {
		res.view('/' + PAGE_PATH, { status: 1, error: 'Что-то пошло не так...', result: list.result });
	}
});

export default router;
