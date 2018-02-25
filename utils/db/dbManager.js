import db from './db';

class dbManager {
	constructor () {
		this.db = new db();
	}

	/*		Video		*/

	getVideoDevices(options = {}) {
		let sql = 'SELECT * FROM video';

		if(options.id) {
			sql += ' WHERE id = ' + parseInt(options.id);
		}

		if(options.order) {
		sql += ' ORDER BY ' + (options.order.by || 'id')  + ' ' + (options.order.type == 'ASC' ? 'ASC' : 'DESC');
		}

		return this.db.query(sql)
		.then(async (out) => {
			if (out && options.id){
				out = out[0];
			}

			if (out && out.length > 0)
			{
				let active = out.find(video => video.active == 1);

				if (!active || active.length == 0){
					out[0].active = 1;
					return new Promise(async (resolve, reject) => { 
						this.updateVideoDevice(out[0].id, out[0].name, out[0].source, out[0].active)
						.then(ret => {
							return {status: 0, result: out};
						})
						.catch (err => {
							return { status: 1, error: 'Ошибка изменения активного видео: ' + err};
						});
						resolve();});
					
				}
			}

			return {status: 0, result: out};
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения списка видео: ' + err};
		});
	}

	createVideoDevice(name, source) {
		return this.db.query('INSERT INTO video (name, source) VALUES (?,?)', [name, source])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION createVideoDevice: ', err);
			return({ status: 1, error: 'Ошибка добавления видео: ' + err});
		});
	}

	removeVideoDevice(id) {
		return this.db.query('DELETE FROM video WHERE id=?', [id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION removeVideoDevice: ', err);
			return({ status: 1, error: 'Ошибка удаления видео (id = ' + id + '): ' + err});
		});
	}

	updateVideoDevice(id, name, source, active = 0) {
		return this.db.query('UPDATE video SET name=?,source=?,active=? WHERE id=?', [name, source, active, id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION updateVideoDevice: ', err);
			return({ status: 1, error: 'Ошибка изменения видео (id = ' + id + '): ' + err});
		});
	}

	setActiveVideoDevice(videoDevice) {
		return this.getVideoDevices()
		.then(async (out) => {
			out = out.result;
			if (out && out.length > 0) {
				let active = out.find(video => video.active == 1);
				if (active)
				{
					this.updateVideoDevice(active.id, active.name, active.source, 0)
					.then(result => {
						if (result.status != 0) {
							throw result.error;
						}
					});
				}

				return this.updateVideoDevice(videoDevice.id, videoDevice.name, videoDevice.source, 1);
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка изменения активного видео: ' + err};
		});
		
	}

	getActiveVideoDevice() {
		return this.getVideoDevices()
		.then(out => {
			if (out && out.length > 0){
				return {status: 0, result: out[0]};
			}

			return { status: 1, error: 'Ошибка получения активного видео: ' + err};
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения активного видео: ' + err};
		});
	}

	/*		Audio		*/

	getAudioDevices(options = {}) {
		let sql = 'SELECT * FROM audio';

		if(options.id) {
			sql += ' WHERE id = ' + parseInt(options.id);
		}

		if(options.order) {
			sql += ' ORDER BY ' + (options.order.by || 'id')  + ' ' + (options.order.type == 'ASC' ? 'ASC' : 'DESC');
		}

		return this.db.query(sql)
		.then(out => {
			if (out && options.id){
				out = out[0];
			}

			if (out && out.length > 0)
			{
				let active = out.find(audio => audio.active == 1);
				if (!active || active.length == 0){
					out[0].active = 1;
					return this.updateAudioDevice(out[0].id, out[0].name, out[0].path, out[0].active)
					.then(ret => {
						return {status: 0, result: out};
					});
				}
			}

			return {status: 0, result: out};
		})
		.catch (err => {
			console.log('EXCEPTION getAudioDevices: ', err);
			return { status: 1, error: 'Ошибка получения списка аудио: ' + err};
		});
	}



	createAudioDevice(name, path) {
		return this.db.query('INSERT INTO audio (name, path) VALUES (?,?)', [name, path])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION createAudioDevice: ', err);
			return({ status: 1, error: 'Ошибка добавления аудио: ' + err});
		});
	}

	removeAudioDevice(id) {
		return this.db.query('DELETE FROM audio WHERE id=?', [id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION removeAudioDevice: ', err);
			return({ status: 1, error: 'Ошибка удаления аудио (id = ' + id + '): ' + err});
		});
	}

	updateAudioDevice(id, name, path, active = 0) {
		return this.db.query('UPDATE audio SET name=?,path=? WHERE id=?', [name, path, id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION updateAudioDevice: ', err);
			return({ status: 1, error: 'Ошибка изменения аудио (id = ' + id + '): ' + err});
		});
	}

	setActiveAudioDevice(audioDevice) {
		return this.getVideoDevices()
		.then(out => {
			if (out && out.length > 0) {
				let active = out.find(audio => audio.acive == 1);
				if (active && active.length > 0)
				{
					return this.updateAudioDevice(active[0].id, active[0].name, active[0].path, 0)
					.then(ret => {
						if (ret.status != 0) {
							throw ret.error;
						}
					});
				}

				return this.updateAudioDevice(audioDevice.id, audioDevice.name, audioDevice.path, 1);
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка изменения активного аудио: ' + err};
		});
		
	}

	getActiveAudioDevice() {
		return this.getAudioDevices()
		.then(out => {
			if (out && out.length > 0){
				return {status: 0, result: out[0]};
			}

			return { status: 1, error: 'Ошибка получения активного аудио: ' + err};
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения активного аудио: ' + err};
		});
	}

	/*		General		*/
	getGeneralSettings() {
		let sql = 'SELECT * FROM general';

		return this.db.query(sql)
		.then(out => {
			let ret = {};

			if(!out) {
				throw 'getGeneralSetting is not working';
			}

			out.forEach(item => {
				ret[item.name] = item.value;
			});

			return { status: 0, result: ret };
		})
		.catch (err => {
			console.log('EXCEPTION getAudioDevices: ', err);
			return { status: 1, error: 'Ошибка получения списка аудио: ' + err};
		});
	}

	updateGeneralSettings(settings = {}) {
		return new Promise((resolve, reject) => {

			let res = {status: 0, error: ''};

			Object.keys(settings).forEach(key => {
				return this.db.query('UPDATE general SET value=? WHERE name=?', [settings[key], key])
				.catch(err => {
					console.log('EXCEPTION updateVideoDevice: ', err);
					res.status = 1;
					res.error = 'Ошибка изменения настроек: ' + err;
				});
			});
			resolve(res);
		});
	}
}

let manager = new dbManager();

module.exports = manager;