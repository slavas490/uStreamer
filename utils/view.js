module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {

		console.log('REQ URL', req.path)
		let params = {
			user: {
				...options
			},
			system: {
				menu: req.settings.menu,
				urlPath: req.path.split('/')
			}
		};

		res.render('index', { page, data: params.user, sys: params.system });
	};

	next();
};