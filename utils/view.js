module.exports = (req, res, next) => {
	
	res.view = (page = 'home', options) => {
		let params = {
			a:1
		};

		res.render('index', { page, data: params });
	};

	next();
};