const Product = require('../model/product');
const WebSocket = require('ws');
const url = require('url');
const ws = new WebSocket.Server({ port: 4000 });
const clients = [];
const isDataSaved = true;
const mongoose = require('mongoose')

ws.on('connection',(ws, req) =>{
	console.log("connected on port 4000");
	
	const pathName = url.parse(req.url).pathname;
	if(pathName == '/products'){
			clients.push(ws);			
		}
	ws.on('message', (data)=>{
		console.log("messeage recieved :"+ data); // recieve data from client
		_message=JSON.parse(data);
		
		if(pathName == '/products' && _message.route=='products' && _message.action=='getAll'){
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

		if(pathName == '/products' && _message.route=='products' && _message.action=='get'){
			Product.findById(_message.id).exec()
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

		if(pathName == '/products' && _message.route=='products' && _message.action=='create'){
			product = new Product({
				_id: new mongoose.Types.ObjectId(),
				name: _message.product.name,
				price: _message.product.price
			})
			product.save()
			.then(docs=>{
				clients.forEach(function each(client){
				client.send(JSON.stringify({message: "Product added successfully!"}));
				});

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

			})
			.catch(error=>{
				clients.forEach(function each(client){
				client.send(error);
				});
			});
				
		}

		if(pathName == '/products' && _message.route=='products' && _message.action=='delete'){
			Product.remove({_id: _message.id}).exec()
			.then(docs=>{
				message = "product not found";
				console.log(docs);
				if(docs.deletedCount>0){
					message = "Product delete successfully!";
				}
				clients.forEach(function each(client){
				client.send(JSON.stringify({message: message}));
				});
			})
			.catch(error=>{
				console.log(error);
				clients.forEach(function each(client){
				client.send(error);
				});
			});
				
		}
	})


});