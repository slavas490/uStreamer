import express from 'express';

const router = express.Router();

// index
router.get('/', (req, res) => {
	res.view();
});

export default router;
