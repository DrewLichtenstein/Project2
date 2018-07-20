document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    socket.emit("create_all_channels");

    if (localStorage.getItem("last_seen_chatroom") === null) {
        console.log("nothing here")
    }
    else {
        var chatroom_name = localStorage.getItem("last_seen_chatroom");
        alert("Seeing message history from channel " + chatroom_name + ". Click a channel to enter.")
        socket.emit("get_message_history", chatroom_name);
    }

    document.querySelector('#new_username').onsubmit = () =>{
                console.log(localStorage.getItem("username"));
                username_entered = document.getElementById("username").value;
                localStorage.setItem("username", username_entered);
                console.log(username_entered);
                return false;
            };

    document.querySelector('#new_channel').onsubmit = () => {
    var channel_name = document.querySelector('#channel').value;
    if (channel_name == "") {
        alert("Enter a channel name!");
        return false;
    }
    else {
    socket.emit('create_one_channel', channel_name);
    return false;
    }
    };


function add_new_channel_to_list (channel_name) {
    const li = document.createElement('li');
    li.innerHTML = channel_name;
    document.querySelector('#channel_unordered_list').append(li);
    li.onclick = render_chat;
}

    function put_all_channels_in_html (channel_list) {
        console.log("here");
        var i;
        for (i = 0; i < channel_list.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = "<p>"+channel_list[i]+"</p>";
            li.setAttribute("id",channel_list[i]);
            li.setAttribute("class","channel")
            document.querySelector('#channel_unordered_list').append(li);
            li.onclick = render_chat;
        }

    }

socket.on("list_one_channel",add_new_channel_to_list);
socket.on("list_all_the_channels", put_all_channels_in_html);

var render_chat = function () {
    document.querySelector("#message_container_div").style.visibility = "visible";
    document.querySelector("#message_list").innerHTML = "";
    var timestamp = new Date();
    var timestamp_string = String(timestamp);
    var current_username = localStorage.getItem("username");
    var chatroom_name = this.id;
    document.getElementById('channel_header').innerHTML = chatroom_name;
    localStorage.setItem("last_seen_chatroom", chatroom_name);
    socket.emit("get_message_history", chatroom_name)

    document.querySelector("#message_sender").onsubmit = () => {
        var message = document.getElementById("message").value;
        socket.emit("message_sent", message, chatroom_name, current_username, timestamp_string);
        return false;};

    function display_message (message) {
        const li = document.createElement('li');
        var button = document.createElement("BUTTON");
        var delete_chat = function () {
            socket.emit("delete_message_history", message, chatroom_name, current_username, timestamp_string)
            this.parentNode.parentNode.removeChild(this.parentNode)
        };
        button.onclick = delete_chat;
        var button_text = document.createTextNode("Delete Message");
        button.appendChild(button_text);
        li.innerHTML = timestamp_string + " "+ "[" + current_username + "]" + ":"+ message;
        li.appendChild(button);
        console.log(localStorage.getItem("username"));
        document.querySelector('#message_list').append(li);};

    socket.on("show_message", display_message);


};

function displayOldMessages (individual_channel_messages) {
        var i;
            for (i = 0; i < individual_channel_messages.length; ++i) {
                const li = document.createElement('li');
                li.innerHTML = individual_channel_messages[i];
                document.querySelector('#message_list').append(li);
        }
}

    socket.on('show_all_messages',displayOldMessages)


});