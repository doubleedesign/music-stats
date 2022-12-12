# Music Stats

**Background/Rationale:** I use iTunes to manage my music library (old school I know - I even still buy albums on CD...and then import them into iTunes). Two of the reasons I do this are the ability to customise the metadata, and the play counts which have roughly been going since 2012. (I say roughly because there was at least one instance where my PC library was temporarily out of sync with my iPod/iPhone and some got lost in the merge, or I had to replace a corrupt file.)

I came to realise that the play counts I'm so committed to don't tell the full story, even with smart playlists like my Top 200 Most Played. Who are my most played artists? What about my most played albums? Which are my most played songs by those artists? etc.

At the same time, I had some vague ideas about a small app that queries the Setlist.fm API to get and show stuff about my concert-going as a learning exercise in creating and using a Node/Express API and various other things, so I decided to combine the two.

## CLI
Console app to locally process iTunes library XML (with some minor alterations), transform the data into a more useful structure, and send it to CosmosDB.

Imports on different dates go into separate CosmosDB containers - idea being that I can later build functionality to compare the data over time (e.g. "Year in Review.")

## Server
Node/Express API app that:
- Further manipulates the data from the iTunes library to provide insights such as albums by artist, play counts of albums, play counts of artists, etc.
- Connects to Setlist.fm to get concert data (work in progress). 
- Will eventually do more things. Roadmap and feature ideas are now being tracked as [GitHub issues](https://github.com/doubleedesign/music-stats/issues).

The API app runs on [Azure App Service](https://azure.microsoft.com/en-us/products/app-service) with the data in a [CosmosDB NoSQL](https://azure.microsoft.com/en-au/products/cosmos-db) database.

All with a lot of help from [lodash](https://lodash.com/) and the [Azure Cosmos DB Client Library for NodeJS](https://www.npmjs.com/package/@azure/cosmos). 

## Frontend
Still to come.

# Demo site
Still to come.
