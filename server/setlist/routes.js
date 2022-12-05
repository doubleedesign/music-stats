import express from 'express';
import { config } from 'dotenv';
import setlistfm from './setlistfm.js';

const router = express.Router();
config();

router.get('/artist/:name', async (req, res, next) => {
	const result = await setlistfm.getArtist(req.params.name);
	res.json(result);
});

router.get('/artist/:name/id', async (req, res, next) => {
	const result = await setlistfm.getArtistId(req.params.name);
	res.send(result);
});

export default router;