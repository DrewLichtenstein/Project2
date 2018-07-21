document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // tell the socket to create all chanels on load
    socket.emit("create_all_channels");

    // renders all messages from the last chatroom the user was in
    if (localStorage.getItem("last_seen_chatroom") === null) {
        alert("Welcome!")
    }
    else {
        var chatroom_name = localStorage.getItem("last_seen_chatroom");
        document.getElementById('channel_header').innerHTML = "Message history from Channel: " + chatroom_name;
        socket.emit("get_message_history", chatroom_name);
    }

    // on submit, sets username in Local Storage
    document.querySelector('#new_username').onsubmit = () =>{
                document.querySelector('#new_username').value = ""
                username_entered = document.getElementById("username").value;
                localStorage.removeItem("username");
                localStorage.setItem("username", username_entered);
                console.log(username_entered);
                document.getElementById("username").value = ""
                return false;
            };
    // on submit, creates a new channel
    document.querySelector('#new_channel').onsubmit = () => {
    var channel_name = document.querySelector('#channel').value;
    document.querySelector('#channel').value = ""
    if (channel_name == "") {
        alert("Enter a channel name!");
        return false;
    }
    else {
    socket.emit('create_one_channel', channel_name);
    return false;
    }
    };

// socket listening for duplicate channel in the list and throws an alert error if channel already exists in the channel list
socket.on("channel_error",alert_channel_error)

function alert_channel_error  () {
    alert("Channel name already taken!")
};

// adds the channel to the HTML and sets them to run the main "render_chat" function on click
function add_new_channel_to_list (channel_name) {
    const li = document.createElement('li');
    li.innerHTML = channel_name;
    document.querySelector('#channel_unordered_list').append(li);
    li.onclick = render_chat;
}

// on-load socket function that puts all the channels from the list into the HTML and sets them to run the main "render_chat" function on click
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

//main "work" is handled in render_chat function --> details below
var render_chat = function () {
    // set the div for messages to visible and then re-set it for the new channel
    document.querySelector("#message_sender").style.visibility = "visible";
    document.querySelector("#message_list").innerHTML = "";
    var chatroom_name = this.id;
    // set the header for the div to the chatroom name
    document.getElementById('channel_header').innerHTML = "Welcome to Channel: " + chatroom_name;
    //set the current chatroom_name to localStorage (see code above)
    localStorage.setItem("last_seen_chatroom", chatroom_name);
    socket.emit("get_message_history", chatroom_name)

    document.querySelector("#message_sender").onsubmit = () => {
        // after a message is submitted, send it to Python to be added to the message_list and then clear the message field
        var message = document.getElementById("message").value + " ";
        // Timestamp and username variables set
        var timestamp = new Date();
        var timestamp_string = String(timestamp);
        var current_username = localStorage.getItem("username");
        document.querySelector("#message").value = "";
        socket.emit("message_sent", message, chatroom_name, current_username, timestamp_string);
        return false;};

    // message comes back from Python and is rendered

    function display_message (message) {
        // create li and delete button elements for a new message
        const li = document.createElement('li');
        var button = document.createElement("BUTTON");
        // if delete button is clicked, the whole element is removed
        var timestamp = new Date();
        var timestamp_string = String(timestamp);
        var current_username = localStorage.getItem("username");
        var delete_chat = function () {
            socket.emit("delete_message_history", message, chatroom_name, current_username, timestamp_string)
            this.parentNode.parentNode.removeChild(this.parentNode)
        };
        button.onclick = delete_chat;
        var button_text = document.createTextNode("Delete Message");
        button.appendChild(button_text);
        // add timestamp, username, and message text to the newly created message
        li.innerHTML = timestamp_string + " "+ "[" + current_username + "]" + ": "+ message;
        li.appendChild(button);
        document.querySelector('#message_list').append(li);};

    socket.on("show_message", display_message);


};
// function called after socketing that takes all of a channel's old messages from Python and adds them to the HTML
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