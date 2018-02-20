import express from 'express';
import { db } from 'utils';

const router = express.Router();

let DB = new db();
DB.query('SELECT * FROM video')
.then(out => {
	console.log('azazaste', out)
})



// index
router.get('/', (req, res) => {
	res.redirect('/');
});

// video devices
router.get('/video', (req, res) => {
	res.view('settings/video', {obj:22});
});

// audio devices
router.get('/audio', (req, res) => {
	res.view('settings');
});


export default router;
