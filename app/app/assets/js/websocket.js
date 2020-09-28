$(function() {
    var socket = null
    var msgBox = $("#chatbox textarea")
    var messages = $("#messages")
    $("#chatbox").submit(function() {
        if (!msgBox.val()) return false
        if (!socket) {
            console.log("No socket connection");
            return false 
        }
        socket.send(msgBox.val())
        msgBox.val("")
        return false
    })
    if (!window["WebSocket"]) {
        console.log("No websocket support.");
    } else {
        socket = new WebSocket("ws://{{.Host}}/room")
        socket.onclose = function() {
            console.log("closed");
        }
        socket.onmessage = function(e) {
            messages.append($('<li>').text(e.data))
        }
    }
})