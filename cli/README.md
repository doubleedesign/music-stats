# Music Library Stats: CLI

Part of a broader project where the data is used by a NodeJS/Express API app.

This is a simple Node console app that takes a `Library.xml` file (which is an iTunes library export with some minor modifications) and parses, transforms, and saves the data in a JSON file (in the `data` folder of the project) ready for the API app (in the `server` folder) and to a CosmosDB NoSQL database container.

To perform the processing of an iTunes XML file:
1. Run `npm install` or `yarn` in this `cli` folder
2. Put your CosmosDB credentials in a `.env` file (or remove that part of `index.ts` if you don't want to send the data to CosmosDB)
3. Place your iTunes export file in the `xml` subfolder
4. Remove playlists from the XML file; the code expects a structure of 
`<plist><dict containing a bunch of keys we don't need><dict of the actual tracks>`
4. Run `npm start` or `yarn start` in this `cli` folder.
