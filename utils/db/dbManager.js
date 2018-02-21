import db from './db';

class dbManager {
	constructor () {
		this.db = new db();
	}

	getVideoDevices(id) {
		return this.db.query('SELECT * FROM video' + (id ? ' WHERE id = ?' : ''), id)
			.then(out => {
				if (out && id){
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
				resolve({ status: 0});
			})
			.catch(err => {
				console.log('EXCEPTION createVideoDevice: ', err);
				reject({ status: 1, error: 'Ошибка добавления видео: ' + err});
			});
	  }

	  removeVideoDevice(id) {
  		return this.db.query('DELETE FROM video WHERE id=?', [id])
			.then(out => {
				resolve({ status: 0});
			})
			.catch(err => {
				console.log('EXCEPTION removeVideoDevice: ', err);
				reject({ status: 1, error: 'Ошибка удаления видео (id = ' + id + '): ' + err});
			});
	  }

	  updateVideoDevice(id, name, source) {
	  		return this.db.query('UPDATE video SET name=?,source=? WHERE id=' + id, [name, source])
				.then(out => {
					resolve({ status: 0});
				})
				.catch(err => {
					console.log('EXCEPTION updateVideoDevice: ', err);
					reject({ status: 1, error: 'Ошибка изменения видео (id = ' + id + '): ' + err});
				});
	  }
}

let manager = new dbManager();

module.exports = manager;