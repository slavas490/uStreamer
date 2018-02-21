import { menu } from 'settings';

module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {
		let params = {
			user: {
				...options
			},
			system: {
				menu,
				urlPath: req.path.split('/')
			}
		};
		
		res.render('index', { page, data: params.user, sys: params.system });
	};

	next();
};