# Project 2

Greetings! All major requested functionality has been implemented, with most of the work being done in index.js and application.py
(and rendered in index.html).

On entering the site for the very first time, the user sees the default "general" channel and the option to register a username
or create their own channel. A registered username is stored in LocalStorage and overwritten whenver a new username is entered. New
channels are Socketed to Python, added to memory there, and then Socketed back to the Javascript to be rednered in HTML.

When a channel is clicked on, it brings up the current chatroom and also saves the channel to LocalStorage -- saving the channel
name to LocalStorage makes it so that if the user leaves and comes back, the messages from the last channel they were on is re-rendered
(on load, the Javascript Sockets to Python to pull all messages that match that channel name and then renders them in a "Message History").

When a user submits a message, Javascript Sockets to Python the message content, username, channel name, and timestamp (saved as a Message Class),
which is stored in the message history list (if there are already 100 or more messages, it pop out the oldest message first). Then Python
Sockets back to the Javascript the same information, which is rendered in the HTML.

Messages also come appended with a "Delete" button which, on click, removes the message from the message list and Sockets back to the
Python to search through the message list and remove that message.

Besides Python, Javascript, and HTML pages, there is a simple CSS page that off-sets the channel to the right of the username and channel
submission forms.
