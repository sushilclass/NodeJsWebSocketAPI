//const http = require('http')
const app = require('./app')
// CONST PORT = PROCESS.ENV.PORT || 5000;
// CONST SERVER = HTTP.CREATESERVER(APP);
// SERVER.LISTEN(PORT);
const Product = require('./model/product');
const WebSocket = require('ws');
const url = require('url');
const ws = new WebSocket.Server({ port: 4000 });
const clients = [];
const isDataSaved = true;
ws.on('connection',(ws, req) =>{
	console.log("connected on port 4000");
	
	const pathName = url.parse(req.url).pathname;
	if(pathName == '/products'){
			clients.push(ws);			
		}
	ws.on('message', (data)=>{
		console.log("messeage recieved :"+ data); // recieve data from client
		if(pathName == '/products' && isDataSaved){
			Product.find().exec()
			.then(docs=>{
				clients.forEach(function each(client){
				client.send(JSON.stringify(docs));
				});
			})
			.catch(error=>{
				clients.forEach(function each(client){
				client.send(error);
				});
			});
				
		}
		
		if(pathName == '/customers/Id'){
			clients.push(ws);			
		}
		if(pathName == '/customers/id'){
			Customer.findfindById(_id).exec()
			.then(docs=>{
				clients.forEach(function each(client){
				client.send(JSON.stringify(docs)); // send data to client
				});
			})
			.catch(error=>{
				clients.forEach(function each(client){
				client.send(error);
				});
			});
				
		}
	})
});

