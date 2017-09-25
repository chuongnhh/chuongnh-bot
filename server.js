
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var login = false;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    console.log('a user connected');

    if (turnon == true) {
        socket.emit('message', 'Đang <b>bật</b>  tự động trả lời tin nhắn.');
    }
    else if (turnon == false) {
        socket.emit('message', 'Đang <b>tắt</b> tự động trả lời tin nhắn.');
    }
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('command', function (msg) {
        console.log('message: ' + msg);

        // turn on
        if (msg.trim() == '1') {
            turnon = true;
            socket.emit('message', 'Đã <b>bật</b> tự động trả lời tin nhắn.');
        }
        else if (msg.trim() == '0') {
            turnon = false;
            socket.emit('message', 'Đã <b>tắt</b> tự động trả lời tin nhắn.');
        }
        else {
            socket.emit('message', 'Đổi câu trả lời thành: ' + msg + ' thành công.');
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});



var login = require("facebook-chat-api");
const fs = require('fs');
var answeredThreads = {};
var turnon = false;

// Create simple echo bot
login({ email: "chuongnh.hcm@gmail.com", password: "&&**chuongnh.HCM" }, function callback(err, api) {
    if (err) return console.error(err);

    api.getFriendsList(function (err, data) {
        if (err) return console.error(err);
    });

    api.listen(function callback(err, message) {

        console.log(message.threadID);

        if (turnon == false) return;
        // nhắn lần đầu tiên
        if (!answeredThreads.hasOwnProperty(message.threadID)) {
            answeredThreads[message.threadID] = true;
            api.sendMessage("Hiện tại mình đang đi ra ngoài, mình sẽ trả lời bạn ngay khi online.", message.threadID);
        }
        else {
            //api.sendMessage("Nếu có việc gấp, vui lòng liên hệ mình qua SĐT: 0164 7931 390", message.threadID);
            api.sendMessage("Hiện tại mình đang đi ra ngoài, mình sẽ trả lời bạn ngay khi online.", message.threadID);
        }
    });
});