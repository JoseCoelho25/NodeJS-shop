//npm nodemon

//so we dont need to always restart the server when we make changes to our code
//after we do npm install nodemon -g we need to setup the package.json and change the scripts so that we simply type npm start to run the server, instead of typing the main folder that was node app.js


//in scripts
//"start": "node app.js" to "start": "nodemon app.js"