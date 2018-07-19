document.addEventListener('DOMContentLoaded', () => {
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on('connect', () => {
document.querySelector('#send_message').onsubmit = () => {
    const message = document.getElementById("message").value;
    socket.emit("message_sent", message);
    return false;
};
});

socket.on('connect', () => {
    socket.emit("get_message_history");
    console.log('drew')
});

function display_messsage(message) {
    const li = document.createElement('li');
    li.innerHTML = message;
    document.querySelector('#all_messages').append(li);
}

socket.on("show_all_messages", showAllMessages);

function showAllMessages(message_list) {
    console.log("here")
    var i;
            for (i = 0; i < message_list.length; ++i) {
                const li = document.createElement('li');
                li.innerHTML = message_list[i];
                document.querySelector('#all_messages').append(li);
        }
}

socket.on("show_message", display_messsage);


});