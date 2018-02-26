import express from 'express';
import { dbManager }  from 'db';
import streamServer from 'streamer';

const router = express.Router();

let PAGE_PATH = 'home';

const getVideoList = async () => {
	let list = await dbManager.getVideoDevices({ order: { type: 'DESC' }});
	let active_id = await dbManager.getActiveVideoDevice();

	if(list && active_id && active_id.result) {
		list.result = list.result.map(item => {
			if(item.id == active_id.result.id) {
				item.active = 1;
			}

			return item;
		})
	}

	return list;
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

	res.view(PAGE_PATH, { videoDevices: video, audioDevices: audio, streamingStartTime: streamServer.startTime });
});

//select device
router.put('/selectDevice', async(req, res) => {
	let query = req.query;

	if(query.id) {
		switch(query.type) {
			case 'video':
				dbManager.setActiveVideoDevice(query.id)
				.then(out => {
					if(out && out.status == 0) {
						streamServer.init()
<<<<<<< HEAD
						.then(() => streamServer.streamerRestart());
=======
						.then(() => streamServer.streamerStart());
>>>>>>> master
					}
				});
				console.log('change video input')
				break;
		}
	}
<<<<<<< HEAD

	res.send({ status: 0 });
});

//streaming
// router.get('/streaming', (req, res) => {
// 	let options = req.query,
// 		command = options.command;

// 	switch (command) {
// 		case 'start':
// 		break;
// 		case 'stop':
// 		break;
// 	}

// 	return {status: 0, message: 'Трансляция начата'}
// });


router.get('/stst', (req, res) => {
	streamServer.streamerStop();
	res.send({ ok:1 });
})
=======
});
>>>>>>> master


router.get('/stst2', (req, res) => {
	streamServer.streamerRestart();
	res.send({ ok:1 });
})

export default router;
