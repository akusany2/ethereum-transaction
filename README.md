# Ethereum Token Distribution Application
## Ankit Kumar - 20149158
---
### Application setup and initiation
To run the application do the following:

Clone or download the application from this repository

Navigate to the root path and run ``` npm install ```

For debugging, install nodemon in global node_modules - ```npm install -g nodemon``` 

Once you have all the dependencies successfully installed, run the npm scripts:

```npm start```

or

```npm run dev``` - for development



### Docker
To run it inside a Docker container, either clone the image from docker hub

```https://hub.docker.com/r/akusan/tokenapp```

or

Build the image in your own local machine by using the commands-

```docker build -t tokenapp .```

```docker run -p 3000:3000 -d tokenapp```


Make sure the port 3000 is free on the local machine, before running the application
