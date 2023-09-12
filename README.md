# CS490
## A backend for the cs490 project (NodeJS, Express)


Build instructions for linux
    
Firstly install NodeJS and npm
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

Next, within the folder containing server.js, set up NodeJS with the Express and cors modules as follows
```bash
npm init
npm i express cors
``` 
Finally, start the server
```bash
node server.js
```

Once all of these steps are completed, the rest call made by the front end should succeed.
