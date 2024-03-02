const ws = require('ws');

const wss = new ws.Server({ port: 8080 }, () => console.log('Server started'));

wss.on('connection', ws => {

    ws.on('message', message => {
        message = JSON.parse(message);
        if (message.type === "create"){
            const id = Math.random().toString(36).substring(7);
            ws.id = id;
            ws.send(JSON.stringify({ roomId: id, type: "create" }));
            return;
        }
        if (message.type === "join"){
            ws.id = message.roomId;
        }
       broadcastConnection(message);
       
    });
});

const broadcastConnection = (message) => {
    
    wss.clients.forEach(client => {
        if (client.id === message.roomId) {
            
            client.send(JSON.stringify(message));
        }
    });
}