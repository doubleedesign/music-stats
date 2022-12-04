import tracks from '../data/tracks.json' assert { type: 'json' };
import _ from 'lodash';

const artists = {
	getAlbums: function(artist) {
		const grouped = _.groupBy(tracks, 'album_artist');
		const this_artist = grouped[artist];
		const albums = _.groupBy(this_artist, 'album');

		const data = Object.entries(albums).map(([title, tracks]) => {
			return {
				title: title,
				year: tracks[0].year,
				total_track_plays: tracks.reduce((accumulator, currentItem) => accumulator + currentItem.play_count, 0),
				tracks: _.sortBy(tracks, ['track_number'])
			};
		});

		return _.sortBy(data, ['year']);
	},

	getTracks: function(artist) {
		const grouped = _.groupBy(tracks, 'album_artist');
		return grouped[artist];
	},

	getSummary: function(artist) {
		const albums = this.getAlbums(artist);

		return {
			name: artist,
			total_plays: albums.reduce((accumulator, currentItem) => accumulator + currentItem.total_track_plays, 0),
			albums: albums.map(album => album.title)
		};
	}
};

export default artists;