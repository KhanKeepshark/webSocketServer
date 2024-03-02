const express = require('express');
const app = express();
const WSServer = require('express-ws')(app);
const aWss = WSServer.getWss();

const PORT = process.env.PORT || 8080;

app.ws('/', (ws, req) => {

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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

const broadcastConnection = (message) => {
    
    aWss.clients.forEach(client => {
        if (client.id === message.roomId) {
            
            client.send(JSON.stringify(message));
        }
    });
}