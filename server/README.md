# Music Library Stats: Server

## Deployment to Azure App Service

To deploy just the `server` folder using GitHub actions:
1. Make sure all dependencies required to run the server are listed in `server/package.json`
2. In the Azure portal, in the App Service app's Settings > Configuration area, under Application settings, add a setting called `PROJECT` with a value of `server`.
3. In the GitHub actions `yaml` file, under jobs > build, add:
```
defaults:
  run:
    working-directory: server
```