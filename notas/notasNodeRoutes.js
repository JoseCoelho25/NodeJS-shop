const fs = require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit"node app.js>Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST'){
        const body = [];
        req.on('data', (chunck)=>{
            console.log(chunck);
            body.push(chunck);
        });
        return req.on('end', ()=>{
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.writeFile('message.txt', message, err =>{
                res.statusCode=302;
                res.setHeader('Location', '/');
                return res.end();
            });   
        }) 
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first node project</title></head>');
    res.write('<body><h1>Hello from node js Server!</h1></body>');
    res.write('</html>');
    res.end();
}

//this is how we export files in node
module.exports = requestHandler;

//we can export diferent functions simply by opening a object after module.exports
module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text'
};

//we can simply shortcut module, since its supported by node js
exports ={
    handler: requestHandler,
    someText: 'Some hard coded text'
};