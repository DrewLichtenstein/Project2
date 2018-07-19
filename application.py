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
    def __init__(self, channel, time_stamp, username, comment):
        self.channel = channel
        self.time_stamp = time_stamp
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
def handle_message(message, chatroom_name, current_username, timestamp):
    readable_time = datetime.datetime.fromtimestamp(timestamp)
    readable_time_string = readable_time.strftime('%Y-%m-%d %H:%M:%S')
    message_information = Message(channel=chatroom_name, time_stamp=readable_time_string, username=current_username, comment=message)
    message_list.append(message_information)
    emit("show_message", message, broadcast=True)

@socketio.on("get_message_history")
def handing_off_messages (chatroom_name):
    individual_channel_messages = []
    for x in message_list:
        if x.channel == chatroom_name:
            individual_channel_messages.append(x.time_stamp + " " + x.username + ": " +x.comment)
            print(x.comment)
    else:
        print("no")

    emit('show_all_messages', individual_channel_messages)
