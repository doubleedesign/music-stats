# Music Stats

**Background/Rationale:** I use iTunes to manage my music library (old school I know - I even still buy albums on CD...and then import them into iTunes). Two of the reasons I do this are the ability to customise the metadata, and the play counts which have roughly been going since 2012. (I say roughly because there was at least one instance where my PC library was temporarily out of sync with my iPod/iPhone and some got lost in the merge, or I had to replace a corrupt file.)

I came to realise that the play counts I'm so committed to don't tell the full story. My top 200 smart playlist shows the various songs I hardly ever skip for some reason and that I played Bruce Springsteen's "Cover Me" a lot after hearing it in concert; and it's fun to see if a song I have on repeat makes it into the list. But Melissa Etheridge not appearing until the 29th song, for example, isn't an accurate representation of my taste. Who are my most played artists? What about my most played albums? Which are my most played songs by those artists? etc.

At the same time, I had some vague ideas about a small app that queries the Setlist.fm API to get and show stuff about my concert-going as a learning exercise in creating and using a Node/Express API and various other things, so I decided to combine the two.

## CLI
Console app to locally process iTunes library XML (with some minor alterations), transform the data into a more useful structure, and send it to CosmosDB.

Imports on different dates go into separate CosmosDB containers - idea being that I can later build functionality to compare the data over time (e.g. "Year in Review.")

## Server
Node/Express API app that:
- Further manipulates the data from the iTunes library to provide insights such as albums by artist, play counts of albums, play counts of artists, etc.
- Connects to Setlist.fm to get concert data (work in progress). 

All with a lot of help from [lodash](https://lodash.com/).

Roadmap and feature ideas are now being tracked as [GitHub issues](https://github.com/doubleedesign/music-stats/issues).

## Frontend
Still to come.
