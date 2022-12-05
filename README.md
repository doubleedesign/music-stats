# Music Stats

## CLI
Console app to process iTunes library XML (with some minor alterations),transform the data into a more useful structure, and save it as a JSON file.

Future ideas:
- Use as a way to find incomplete/inconsisent meta data and prompt for correction. 
- Work out what metadata is used (or should be used) for artists featured in another artist's work, in a way that can be used in the API. 

## Server
Node/Express API app that:
- Further manipulates the data from the iTunes library to provide insights such as albums by artist, play counts of albums, play counts of artists, etc.
- Connects to Setlist.fm to get concert data (in progress). 

Ideas for concert data:
- Calculate things like most played songs in concert.
- Create a dataset of concerts I've attended. Include data ready to put them on a map and to create stats and charts of things like average per year.
- Compare my most played songs to those played in concert, including all concerts and those I was at.

Other ideas:
- Find a way to associate multiple versions of the same song, in a way that still keeps the track data separate but it can be counted together. I generally don't keep multiple identical versions of the same song (e.g., from an album _and_ a Best Of), but do have studio and live versions (sometimes multiple). For example, a variation on counting most played tracks that counts the In Blue, Unplugged, and Live in Dublin versions of The Corrs 'Radio' as one song, to correctly count how many times I've played 'Radio' when deciding my most played songs.

## Frontend
Still to come.
