import express from 'express';
import artistRoutes from './itunes-library/routes.js';

const app = express();
app.use(express.urlencoded())
app.use(express.json())

app.use('/artist', artistRoutes);

app.listen(4000, () => {
	console.log('Server running on port 4000');
});