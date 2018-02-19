import menu from './menu';

module.exports = (req, res, next) => {
	req.settings = {
		menu
	};

	next();
};