console.log("Hello world");

var firebase = require("firebase");

var FCM = require('fcm-push-notif');
var serverKey = 'AIzaSyDnaoK0AOYC8peJZn3HvDQc-zv6hL-Bukg';
var fcm = new FCM(serverKey);


firebase.initializeApp({
  serviceAccount: "./Bespoke Jockey-5496b7ff6456.json",
  databaseURL: "https://bespoke-jockey.firebaseio.com/"
});

var db = firebase.database();
var chatsRef = db.ref("chats");
var pushTokensRef = db.ref("pushTokens");

chatsRef.on("child_changed", function(snapshot) {
    var changedChat = snapshot.val();
    console.log("changed chat: " + JSON.stringify(changedChat));
    sendNewMessagePushNotification(changedChat.default.guestID);
});

function sendNewMessagePushNotification(userID, messageText) {
    var message = {
        collapse_key: 'new message',
        notification: {
            title: "New Message From the Front Desk",
            body: "You have a new message from the front desk"
        }
    };

    getUserPushToken(userID, function(pushToken) {
        sendPushNotification(pushToken, message);
    });
}

function getUserPushToken(userID, callback) {
    db.ref("pushTokens/" + userID).once("value").then(function(snapshot) {
        callback(snapshot.val());
    })
    .catch(function(error) {
        console.log("got error getting push token");
        console.log(error);
    });
}

function sendPushNotification(pushToken, message) {
    message.to = pushToken;

    fcm.send(message)
        .then(function (response) {
            console.log("Successfully sent with response: " + response);
        })
        .catch(function (error) {
            console.log("Got error: " + error);
        });
}
