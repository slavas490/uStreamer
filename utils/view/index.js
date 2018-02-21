import { menu } from 'settings';

const { URL } = require('url');

module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {
		let url =  (new URL(req.protocol + '://' + req.get('host') + req.originalUrl)).pathname;
		let params = {
			user: {
				...options
			},
			system: {
				menu,
				urlPath: url.split('/')
			}
		};
		
		res.render('index', { page, data: params.user, sys: params.system });
	};

	next();
};