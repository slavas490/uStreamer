import sqlite3 from 'sqlite3';

class db {
	constructor () {
		this.db = new sqlite3.Database('./db/database.db', (err) => {
			if (err) {
				this.isConnected = true;
			}
			else {
				this.isConnected = false;
			}
		});
	}

	query (sql, params = []) {
	 	return new Promise((resolve, reject) => {
	 		this.db.all(sql, params, (err, rows) => {
	 			if (err) {
	 				reject(err);
	 			}
				else {
					resolve(rows);
				}
	 		});
	 	});
	}
}

module.exports = db;