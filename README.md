# CS490-backend
## A backend for the cs490 project (NodeJS, Express)

Build instructions for linux
   
First, install NodeJS and npm
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

Next, within the folder containing server.js, install the dependencies defined in package.json as follows
```bash
npm install
``` 
Finally, start the server
```bash
node server.js
```

Once all of these steps are completed, the rest call made by index.html on the frontend should succeed.
