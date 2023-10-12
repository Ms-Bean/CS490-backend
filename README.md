# CS490-backend

# Build instructions for linux

## Configuration
Firstly, near the top of server.js, replace the database name, database username and password with yours.
```js
let database_name = "sakila" //Replace with your database name
var con = mysql.createConnection({ 
    host: "localhost",
    user: "root", //Replace with your user
    password: "cactusgreen" //Replace with your password
});
```
If you want to host it locally on port 3500, you're done with configuration. Otherwise change the following line of code at the top of common.js in the frontend.
```js
let server_url="http://localhost:3500/" //Replace with your server url. (With the slash at the end, it is important)
```
and the following line in the backend at the top of server.js
```js
const PORT = 3500; //Replace with your desired port
```

## Installation and running
Next, run the following commands to install node and run server.js, while in the backend directory.
It is important that the directory containing server.js is the working directory while doing this.
```bash
sudo apt update

sudo apt install nodejs #Installs nodejs

npm install #Installs the packages as defined in package.json

node server.js #Starts the server.
```

After this is completed, the html files in the front-end should be interactive and be able to communicate with the server through fetch calls.

Also, a video demonstration of the sever working so far can be found here.
https://www.youtube.com/watch?v=AExKr4F5Tt8