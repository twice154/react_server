const io = jest.genMockFromModule('socket.io-client');
var connect = (d,f)=>{
    console.log(d)
    var socket = {}
    var on =(a,b)=>{console.log(a,' at on')}
    var emit =(a,b)=>{console.log(a,' at emit')}
    var disconnect=()=>{console.log('disconnected()')}
    socket.on=on;
    socket.emit=emit
    socket.disconnect=disconnect

    return socket
}

io.connect = connect;//socket객체. on, disconnect, emit

export default io
