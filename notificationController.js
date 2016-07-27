console.log("Hello world");

var firebase = require("firebase");

var FCM = require('fcm-push-notif');
var serverKey = 'AIzaSyDnaoK0AOYC8peJZn3HvDQc-zv6hL-Bukg';
var fcm = new FCM(serverKey);


firebase.initializeApp({
  serviceAccount: "../Bespoke Jockey-e3ea1842d9dc.json",
  databaseURL: "https://databaseName.firebaseio.com"
});

var db = firebase.database();
var chatsRef = db.ref("chats");

chatsRef.on("child_changed", function(snapshot) {
    var changedChat = snapshot.val();
});

function pushNewMessageNotification(pushUserID, messageText) {

    var message = {
        'to': pushUserID,
        collapse_key: 'new message',
        notification: {
            title: "New Message From the Front Desk",
            body: messageText
        }
    };

    fcm.send(message)
        .then(function (response) {
            console.log("Successfully sent with response: " + response);
        })
        .catch(function (error) {
            console.log("Got error: " + eror);
        });
}