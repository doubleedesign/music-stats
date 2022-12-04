import express from 'express';
import libraryRoutes from './itunes-library/routes.js';
import setlistRoutes from './setlist/routes.js';

const app = express();
app.use(express.urlencoded());
app.use(express.json());

app.use('/library', libraryRoutes);
app.use('/setlist', setlistRoutes);

app.listen(4000, () => {
	console.log('Server running on port 4000');
});