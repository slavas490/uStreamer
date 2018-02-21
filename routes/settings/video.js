import express from 'express';
import { dbManager }  from 'db';

const router = express.Router();

let PAGE_PATH = 'settings/video';
	
console.log('DDDDBBBB', dbManager);

router.get('/', async (req, res) => {
	let out = await dbManager.getVideoDevices()

	 res.view(PAGE_PATH, { result: out.result });
});

//// create new video device
router.post('/create', async (req, res) => {
	let form = req.body;

	if(!form || !form.name || !form.url) {
		return res.view(PAGE_PATH, { status: 1, error: 'Необходимо заполнить все поля!' });
	}

	let out = dbManager.createVideoDevice(form.name, form.url);
	if (out.status == 0) {
		res.redirect('/'); 
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...' });
	}
});

//// remove video device
router.delete('/remove/:id', async (req, res) => {
	console.log('REMOVE id=', req.params.id)
	let out = await dbManager.removeVideoDevice(req.params.id);
	if (out.status == 0) {
		res.redirect('/'); 
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...' });
	}
});

//// update video device
router.get('/update/:id', async (req, res) => {
	console.log('UPDATE START ', req.params.id)
	let out = await dbManager.getVideoDevices();

	if (out.status == 0) {
		res.redirect('/' + PAGE_PATH + '/' + req.params.id); 
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...' });
	}
});

router.post('/update/:id', async (req, res) => {
	let form = req.body;

	if(!form || !form.name || !form.url) {
		return res.view(PAGE_PATH, { status: 1, error: 'Необходимо заполнить все поля!' });
	}

	let out = await dbManager.updateVideoDevice(req.params.id, form.name, form.url);
	if (out.status == 0) {
		res.redirect('/'); 
	}
	else {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...' });
	}
});

export default router;
