# Music Stats

**Background/Rationale:** I use iTunes to manage my music library (old school I know - I even still buy albums on CD...and then import them into iTunes). Two of the reasons I do this are the ability to customise the metadata, and the play counts which have roughly been going since 2012. (I say roughly because there was at least one instance where my PC library was temporarily out of sync with my iPod/iPhone and some got lost in the merge, or I had to replace a corrupt file.)

I came to realise that the play counts I'm so committed to don't tell the full story. My top 200 smart playlist shows the various songs I hardly ever skip for some reason and that I played Bruce Springsteen's "Cover Me" a lot after hearing it in concert; and it's fun to see if a song I have on repeat makes it into the list. But Melissa Etheridge not appearing until the 29th song, for example, isn't an accurate representation of my taste. Who are my most played artists? What about my most played albums? Which are my most played songs by those artists? etc.

At the same time, I had some vague ideas about a small app that queries the Setlist.fm API to get and show stuff about my concert-going as a learning exercise in creating and using a Node/Express API and various other things, so I decided to combine the two.

## CLI
Console app to locally process iTunes library XML (with some minor alterations), transform the data into a more useful structure, and save it as a JSON file.

Future ideas:
- Use as a way to find incomplete/inconsisent meta data and prompt for correction. 
- Work out what metadata is used (or should be used) for artists featured in another artist's work, in a way that can be used in the API. 

## Server
Node/Express API app that:
- Further manipulates the data from the iTunes library to provide insights such as albums by artist, play counts of albums, play counts of artists, etc. 
  - The specifics of data returned is different according to the context.
  - Currently broken up into three main modules: Artists, albums, and tracks. Some duplication of functionality is there though, so still considering if some things should be brought together in a utils module or something.
- Connects to Setlist.fm to get concert data (in progress). 

All with a lot of help from [lodash](https://lodash.com/).

Ideas for concert data:
- Calculate most played songs in concert, songs opened with, songs played as encores.
- Calculate percentage difference in the sets played on a tour.
- Calculate stats about songs played geographically (e.g., Melissa Etheridge plays mostly her early work in Australia and plays newer stuff in the US, how to show this?)
- Create a dataset of concerts I've attended. Include data ready to put them on a map and to show stats.
- Compare my most played songs to those played in concert (both all concerts and those I was at).

Other ideas:
- Find a way to associate multiple versions of the same song, in a way that still keeps the track data separate but it can be counted together. I generally don't keep multiple identical versions of the same song (e.g., from an album _and_ a Best Of), but do have studio and live versions (sometimes multiple). For example, a variation on counting most played tracks that counts the In Blue, Unplugged, and Live in Dublin versions of The Corrs 'Radio' as one song, to correctly count how many times I've played 'Radio' when deciding my most played songs.
- Identify cover versions and find ways to use that information.
- Add more complete metadata for the composer field - consider writers, producers etc; then what can be done with that data (consider Discogs API rather than manual?).
- Better handling of Best Of/Greatest Hits/etc compilations: Currently, I generally reassign tracks on these albums to their original album if there is one and avoid having duplicates. But it would be cool to have "appears on" data for songs (which would also link into the grouping of versions). Discogs or a similar API might be good for this, to show such data without having duplicates in my actual library.
- Add functionality for annual play counts (calculated from the difference between a new upload and the previous data) and use them for annual summary (inspired by Spotify Wrapped). 

General TODOs:
- TypeScript everything.
- Unit tests.
- Automatic deployment from GitHub.

## Frontend
Still to come.
