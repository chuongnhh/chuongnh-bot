
const Simsimi = require('simsimi');

var simsimi = new Simsimi({
    key: '5f9e6803-5335-4203-af19-176291421416'
});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var login = false;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) {
    console.log('a user connected');

    if (turnon == '1') {
        socket.emit('message', 'Đang <b>bật</b>  tự động trả lời tin nhắn.');
    }
    else if (turnon == '2') {
        socket.emit('message', 'Đang <b>bật</b> simi trả lời tin nhắn.');
    }
    else if (turnon == '0') {
        socket.emit('message', 'Đang <b>tắt</b> tự động trả lời tin nhắn.');
    }
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('command', function (msg) {
        console.log('message: ' + msg);

        // turn on
        if (msg.trim() == '1') {
            turnon = '1';
            console.log('1');
            socket.emit('message', 'Đã <b>bật</b> tự động trả lời tin nhắn.');
        }
        else if (msg.trim() == '0') {
            turnon = '0';
            console.log('0');
            socket.emit('message', 'Đã <b>tắt</b> tự động trả lời tin nhắn.');
        }
        else if (msg.trim() == '2') {
            turnon = '2';
            console.log('2');
            socket.emit('message', 'Đã <b>bật</b> simi trả lời tin nhắn.');
        }
        else {
            socket.emit('message', 'Đổi câu trả lời thành: ' + msg + ' thành công.');
        }
    });
});

http.listen(process.env.PORT || 8080, function () {
    console.log('listening on *:8080')
})


var login = require("facebook-chat-api");
const fs = require('fs');
var answeredThreads = {};
var turnon = 0;

// Create simple echo bot
login({ email: "chuongnh.hcm@gmail.com", password: "&&**chuongnh.HCM" }, function callback(err, api) {
    if (err) return console.error(err);

    api.getFriendsList(function (err, data) {
        if (err) return console.error(err);
    });

    api.listen(function callback(err, message) {

        console.log(message.body);

        if (turnon == '0') { return; }
        else if (turnon == '1') {
            // nhắn lần đầu tiên
            if (!answeredThreads.hasOwnProperty(message.threadID)) {
                answeredThreads[message.threadID] = true;
                api.sendMessage("Hiện tại mình đang đi ra ngoài, mình sẽ trả lời bạn ngay khi online. [Tin nhắn được gửi tự động]", message.threadID);
                //api.sendMessage("Nhắn '1' để nhắn tin với bot. [Tin nhắn được gửi tự động]", message.threadID);
            }
            else {
                //api.sendMessage("Nếu có việc gấp, vui lòng liên hệ mình qua SĐT: 0164 7931 390", message.threadID);
                //api.sendMessage("Hiện tại mình đang đi ra ngoài, mình sẽ trả lời bạn ngay khi online. [Tin nhắn được gửi tự động]", message.threadID);

                if (message.body == '2') {
                    turnon = 2;
                    api.sendMessage("Đã bật nhắn tin với simi", message.threadID);
                }
                else if (message.body == '0') {
                    turnon = 0;
                    api.sendMessage("Đã tắt nhắn tin với simi", message.threadID);
                }
                else {
                    api.sendMessage("Nhắn '2' để nhắn tin với simi.", message.threadID);
                    api.sendMessage("Nhắn '0' để tắt nhắn tin với simi.", message.threadID);
                }
            }
            return;
        }
        else if (turnon == '2') {
            simsimi.listen(message.body, function (err, rep) {
                if (err) {
                    //api.sendMessage('Hỏng hiểu', message.threadID);
                    return console.error(err)
                };
                console.log('simsimi say:', rep);
                api.sendMessage(rep, message.threadID);
            });
            return;
        }

    });
});