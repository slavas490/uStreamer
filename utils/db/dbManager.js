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
		.then(out => {
			if (out) {
				if(options.id) {
					out = out[0];
				}

				return {status: 0, result: out};
			}
			else {
				return {status: 0, result: []};
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения списка видео устройств: ' + err};
		});
	}

	createVideoDevice(name, source) {
		return this.db.query('INSERT INTO video (name, source) VALUES (?,?)', [name, source])
		.then(out => {
			return({ status: 0 });
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка добавления видео устройства: ' + err});
		});
	}

	removeVideoDevice(id) {
		return this.db.query('DELETE FROM video WHERE id=?', id)
		.then(out => {
			return({ status: 0 });
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка удаления видео устройства (id = ' + id + '): ' + err});
		});
	}

	updateVideoDevice(id, name, source) {
		return this.db.query('UPDATE video SET name=?, source=? WHERE id=?', [name, source, id])
		.then(out => {
			return({ status: 0 });
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка изменения видео устройства (id = ' + id + '): ' + err});
		});
	}

	setActiveVideoDevice(id) {
		return this.db.query('UPDATE video SET active = CASE WHEN id = ? THEN 1 ELSE 0 END', id)
		.then(out => {
			return { status: 0 };
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка изменения активного видео устройства: ' + err};
		});
	}

	getActiveVideoDevice() {
		return this.db.query('SELECT * FROM video WHERE active=1')
		.then(out => {
			if (out && out.length > 0){
				return { status: 0, result: out[0] };
			}
			else {
				return this.db.query('SELECT * FROM video ORDER BY id DESC LIMIT 1');
			}
		})
		.then(out => {
			if(out) {
				if (out.result){
					return out;
				}
				else {
					return { status: 0, result: out[0] }; 
				}
			}
			else {
				return { status: 0, result: [] }; 
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения активного видео устройства: ' + err};
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
			if (out) {
				if(options.id) {
					out = out[0];
				}

				return {status: 0, result: out};
			}
			else {
				return {status: 0, result: []};
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения списка аудио устройств: ' + err};
		});
	}

	createAudioDevice(name, path) {
		return this.db.query('INSERT INTO audio (name, path) VALUES (?,?)', [name, path])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка добавления аудио устройства: ' + err});
		});
	}

	removeAudioDevice(id) {
		return this.db.query('DELETE FROM audio WHERE id=?', id)
		.then(out => {
			return({ status: 0 });
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка удаления аудио устройства (id = ' + id + '): ' + err});
		});
	}

	updateAudioDevice(id, name, path, active = 0) {
		return this.db.query('UPDATE audio SET name=?,path=? WHERE id=?', [name, path, id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			return({ status: 1, error: 'Ошибка изменения аудио устройства (id = ' + id + '): ' + err});
		});
	}

	setActiveAudioDevice(id) {
		return this.db.query('UPDATE audio SET active = CASE WHEN id = ? THEN 1 ELSE 0 END', id)
		.then(out => {
			return { status: 0 };
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка изменения активного аудио устройства: ' + err};
		});
	}

	getActiveAudioDevice() {
		return this.db.query('SELECT * FROM audio WHERE active=1')
		.then(out => {
			if (out && out.length > 0){
				return { status: 0, result: out[0] };
			}
			else {
				return this.db.query('SELECT * FROM audio ORDER BY id DESC LIMIT 1');
			}
		})
		.then(out => {
			if(out) {
				if (out.result){
					return out;
				}
				else {
					return { status: 0, result: out[0] }; 
				}
			}
			else {
				return { status: 0, result: []}; 
			}
		})
		.catch (err => {
			return { status: 1, error: 'Ошибка получения активного аудио устройства: ' + err};
		});
	}


	/*		General		*/
	getGeneralSettings() {
		return this.db.query('SELECT * FROM general')
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
			return { status: 1, error: 'Ошибка получения общих настроек: ' + err};
		});
	}

	updateGeneralSettings(settings = {}) {
		return new Promise((resolve, reject) => {
			let res = { status: 0, error: '' };

			Object.keys(settings).forEach(async (key) => {
				this.db.query('UPDATE general SET value=? WHERE name=?', [settings[key], key])
				.catch(err => {
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