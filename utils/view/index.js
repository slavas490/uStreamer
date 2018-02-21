import { menu } from 'settings';

module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {
		console.log('	PATH', req.path);
		console.log('	URL', req.url);req.originalUrl
		console.log('	originalUrl', req.originalUrl);
		let params = {
			user: {
				...options
			},
			system: {
				menu,
				urlPath: req.originalUrl.split('/')
			}
		};
		
		res.render('index', { page, data: params.user, sys: params.system });
	};

	next();
};