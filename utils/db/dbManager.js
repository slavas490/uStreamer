import db from './db';

class dbManager {
	constructor () {
		this.db = new db();
	}

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
				console.log('EXCEPTION getVideoDevices: ', err);
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
	  		return this.db.query('UPDATE video SET name=?,source=? WHERE id=' + id, [name, source])
				.then(out => {
					return({ status: 0});
				})
				.catch(err => {
					console.log('EXCEPTION updateVideoDevice: ', err);
					return({ status: 1, error: 'Ошибка изменения видео (id = ' + id + '): ' + err});
				});
	  }
}

let manager = new dbManager();

module.exports = manager;