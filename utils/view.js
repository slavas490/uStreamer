module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {

		console.log('REQ URL', req.path)
		let params = {
			user: {
				...options
			},
			system: {
				menu: req.settings.menu
			}
		};

		res.render('index', { page, data: params.user, sys: params.system, path: req.path });
	};

	next();
};