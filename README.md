# CS490-backend
## A backend for the cs490 project (NodeJS, Express)


Build instructions for linux

By default, this branch deploys to heroku on a heroku-assigned port. To host locally, the port should be changed. To automate this, I used a bash script as solution to automtically switch it to port 3500, so first the following bash script should be run.
```bash
chmod 777 switch_to_local.sh
./switch_to_local.sh
```
    
Next, install NodeJS and npm
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

Once all of these steps are completed, the rest call made by the front end should succeed.
