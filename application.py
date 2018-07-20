import os, datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# list of all channels
channel_list = ['general']

# message class

class Message:
    def __init__(self, channel, timestamp, username, comment):
        self.channel = channel
        self.timestamp = timestamp
        self.username = username
        self.comment = comment

#list of messages
message_list = []

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create_one_channel")
def one_channel_creator(channel_name):
    channel_list.append(channel_name)
    emit("list_one_channel", channel_name, broadcast=True)

@socketio.on("create_all_channels")
def making_all_channels_onload():
    emit("list_all_the_channels", channel_list, broadcast=True)

@socketio.on("message_sent")
def handle_message(message, chatroom_name, current_username, timestamp_string):
    message_information = Message(channel=chatroom_name, timestamp=timestamp_string, username=current_username, comment=message)
    if len(message_list) < 100:
        message_list.append(message_information)
    else:
        message_list.pop()
        message_list.append(message_information)
    emit("show_message", message, broadcast=True)

@socketio.on("get_message_history")
def handing_off_messages (chatroom_name):
    individual_channel_messages = []
    for x in message_list:
        if x.channel == chatroom_name:
            individual_channel_messages.append(x.timestamp + " " + "["+ x.username +"]" + ": " +x.comment)
    emit('show_all_messages', individual_channel_messages)

@socketio.on("delete_message_history")
def find_message_and_delete (message, chatroom_name, current_username, timestamp_string):
    for x in message_list:
        if x.channel == chatroom_name and x.timestamp == timestamp_string and x.comment == message:
            message_list.remove(x)