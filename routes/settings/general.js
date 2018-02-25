import express from 'express';
import { dbManager }  from 'db';

const router = express.Router();
let PAGE_PATH = 'settings/general';


// index
router.get('/', async (req, res) => {
    let out = await dbManager.getGeneralSettings();

	if (out.status == 0) {
		res.view(PAGE_PATH, { result: out.result });
	}
	else {
		res.view(PAGE_PATH, { status: 1, result: out.result, error: 'Что-то пошло не так...' });
	}
});

// change settings
router.post('/', async (req, res) => {
	let form = req.body;

	if(!form || !form.youtube_url || !form.youtube_key) {
		let out = await dbManager.getGeneralSettings();
		return res.view(PAGE_PATH, {status: 1, error: 'Необходимо заполнить все поля', result: out.result})
	}

	let ret = await dbManager.updateGeneralSettings(form);
	let out = await dbManager.getGeneralSettings();

	if (ret.status == 0) {
		res.view(PAGE_PATH, { status: 0, result: out.result, success: 'Успешно изменено'});
	}
	else {
		res.view(PAGE_PATH, { status: 1, result: out.result, success: 'Что-то пошло не так...'});
	}
});

export default router;