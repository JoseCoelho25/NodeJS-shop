const http = require('http');
//fs faz parte dos pacotes do node file system, e é usado para poder criar ficheiros dentro do node

// to use routes in node
const routes = require('./routes.js');
// server that import the routes
const server = gttp.createServer(routes.handler);

const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit"node app.js>Send</button></form></body>');
        res.write('</html>');
        //aqui temos de fazer return, para o node nao continuar a correr o código. com o res.write quando fazemos res.end nao podemos ter mais abaixo outros res.write, senao o server crash.
        return res.end();
    }
    if (url === '/message' && method === 'POST'){
        const body = [];
        //req.on é um eventListener que diz basicamente fica á espera de receber comandos/dados
        req.on('data', (chunck)=>{
            console.log(chunck);
            body.push(chunck);
        });
        req.on('end', ()=>{
            //aqui usamos o buffer para utilizar os dados que o utilizador colocou no input, converter para string. Os dados sao recebido como key e value, como num objeto. Aparece no console.log como message=input, pois o message foi o nome que escolhemos dar no html- name="message"
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            //FileSync é um método sincrono, que força uma paragem na leitura de codigo pelo node. Bloqueia a execuçao do resto do codigo até este estar feito.
            fs.writeFileSync('message.txt', message);
            //devemos usar o writeFile pois este nao obriga a paragem da leitura do codigo. Se tivessemos um ficheiro enorme ia forçar a leitura pelo node que iria lentificar o resto do processo
            fs.writeFile('message,txt', message, err =>{
                res.statusCode=302;
                res.setHeader('Location', '/');
                return res.end();
            })
            //neste contexto recebe um terceiro argumento, que retorna um error check neste caso cahmamos err, que podemos apresentar uma resposta ao user.
        })
        
        //estes dados do res.status e res.setHeader têm que ficar fora do eventlistenter, pois se os colocassemos dentro os dados ficariam á espera para ser corridos. o node simplesmente regista os listeners, mas nao os corre imediatamente. Ele ia continuar para o codigo na linha 36
        res.statusCode=302;
        res.setHeader('Location', '/');
        return res.end();
    }
    //e so depois de terminado este codigo principal, é que o node vai correr os listeners e as suas condiçoes if. Neste caso se o codigo acima estivesse no eventListener, ia dar erro pois nos ja fechamos o res.write, logo nao podemos ter mais res.writes.
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first node project</title></head>');
    res.write('<body><h1>Hello from node js Server!</h1></body>');
    res.write('</html>');
    res.end();
});

server.listen(3000);