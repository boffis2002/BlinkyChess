const io = require('socket.io')();

function init(server) {
    io.attach(server);

    io.on('connection', function(socket){
        socket.on('join room', (data) => {
            let { room, user } = data;
            console.log('user '+user+' joined the room');
            socket.join(room);
        });
        socket.on('move', (data) => {
            let { room, fen } = data;
            io.to(room).emit('update board', fen);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}
const EventEmitter = require('events');
const eventBus = new EventEmitter();

eventBus.on('broadcast', function(event){
    console.log('Broadcasting', event);
    io.emit(event.topic, event.payload);
});

module.exports.eventBus = eventBus;
module.exports.init = init;
