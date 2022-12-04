# Music Library Stats: CLI

Part of a broader project where the data is used by a NodeJS/Express API app.

This is a simple Node console app that takes a `Library.xml` file (which is an iTunes library export with some minor modifications) and parses, transforms, and saves the data in a JSON file (in the `data` folder of the project) ready for the API app (in the `server` folder). 

To perform the processing of the XML file, simply run `npm start` in this `cli` folder.