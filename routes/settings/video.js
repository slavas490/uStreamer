import express from 'express';
import { db } from 'utils';

const router = express.Router();

let PAGE_PATH = 'settings/video';

// video devices list
router.get('/', (req, res) => {
	res.view(PAGE_PATH);
});

// create new video device
router.post('/', (req, res) => {
	let DB = new db(),
		form = req.body;

	if(!form || !form.name || !form.url) {
		return req.view(PAGE_PATH, { status: 1, error: 'Необходимо заполнить все поля!' });
	}

	DB.query('INSERT INTO video (name, source) VALUES (?,?)', [form.name, form.url])
	.then(out => {
		res.view(PAGE_PATH, { status: 0 });
	})
	.catch(err => {
		res.view(PAGE_PATH, { status: 1, error: 'Что-то пошло не так...' });
	});

	DB.close();
});

export default router;
