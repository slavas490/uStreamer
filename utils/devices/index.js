import { spawn } from 'child_process';

class devicesManager {
	getMediaDevices() {
		let regex = /\[dshow[^\]]+\]([^\n]+)/g;

		return new Promise((resolve, reject) => {
			try {
				let buff = '';

				let ffmpeg = spawn('ffmpeg', ' -list_devices true -f dshow -i dummy'.split(' '), {
						detached: false
					});

				ffmpeg.stdout.on('data', data => {
					buff += data.toString();
				});

				ffmpeg.stderr.on('data', data => {
					buff += data.toString();
				});

	            ffmpeg.on('exit', function () {
					let m,
						group,
						isAlternativeName = false,
						_item = {},
						result = { 
							video: [],
							audio: []
						};

					while ((m = regex.exec(buff)) !== null) {
						if (m.index === regex.lastIndex) {
							regex.lastIndex++;
						}

						if(m && m[1]) {
							m = m[1];

							if(m.includes('DirectShow video devices')) {
								group = 'video';
							}
							else if(m.includes('DirectShow audio devices')) {
								group = 'audio';
							}
							else {
								if(!isAlternativeName) {
									_item.name = m.replace(/"/g, '').trim();

									isAlternativeName = true;
								}
								else {
									_item.path = m.replace('Alternative name', '').replace(/"/g, '').trim();
									result[group].push(_item);
									_item = {};	

									isAlternativeName = false;
								}
							}
						}
					}

					resolve(result)
				});
			}
			catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = devicesManager;