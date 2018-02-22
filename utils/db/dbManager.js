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
			if (out && options.id){
				out = out[0];
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

	updateVideoDevice(id, name, source) {
		return this.db.query('UPDATE video SET name=?,source=? WHERE id=?', [name, source, id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION updateVideoDevice: ', err);
			return({ status: 1, error: 'Ошибка изменения видео (id = ' + id + '): ' + err});
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

	updateAudioDevice(id, name, path) {
		return this.db.query('UPDATE audio SET name=?,path=? WHERE id=?', [name, path, id])
		.then(out => {
			return({ status: 0});
		})
		.catch(err => {
			console.log('EXCEPTION updateAudioDevice: ', err);
			return({ status: 1, error: 'Ошибка изменения аудио (id = ' + id + '): ' + err});
		});
	}
}

let manager = new dbManager();

module.exports = manager;