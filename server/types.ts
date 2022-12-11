export type Track = {
	track_id: number;
	persistent_id: string;
	name: string;
	play_count: number,
	total_time: string;
	artist: string;
	album_artist: string;
	composer: string;
	album: string;
	sort_album: string;
	track_number: number;
	year: string;
	genre: string;
	// Fields prefixed with _ are fields automatically added by CosmosDB.
	_rid?: string;
	_self?: string;
	_etag?: string;
	_attachments?: string;
	_ts?: number;
}

export type Album = {
	title: string,
	artist?: string,
	year: number | string,
	total_track_plays: number,
	tracks?: Track[]
}

export type Artist = {
	name: string;
	total_plays: number;
	albums: string[];
	most_played: {
		albums: Album[]
		tracks: Track[]
	}
}

export type TrackResponse = {
	status: number;
	message?: string;
	data: Track | undefined
}

export type TracksResponse = {
	status: number;
	message?: string;
	tracks: Track[]
}

export type AlbumResponse = {
	status: number;
	message?: string;
	data: Album | undefined
}
