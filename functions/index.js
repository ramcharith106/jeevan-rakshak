const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNewRequestNotification = functions.firestore
  .document("requests/{requestId}")
  .onCreate(async (snap, context) => {
    const newRequest = snap.data();

    // 1. Get the state and blood group from the new request.
    const requestState = newRequest.state;
    const requestBloodGroup = newRequest.bloodGroup;

    if (!requestState) {
      console.log("New request is missing a state. No notifications sent.");
      return null;
    }

    // 2. Query the 'users' collection for available donors in that state.
    const usersSnapshot = await admin.firestore().collection("users")
      .where("state", "==", requestState)
      .where("availability", "==", true)
      .get();

    if (usersSnapshot.empty) {
      console.log("No donors found in the state:", requestState);
      return null;
    }

    // 3. Collect all the FCM device tokens from the matching donors.
    const tokens = [];
    usersSnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.fcmTokens && user.fcmTokens.length > 0) {
        tokens.push(...user.fcmTokens);
      }
    });

    if (tokens.length === 0) {
      console.log("No device tokens found for donors in", requestState);
      return null;
    }

    // 4. Create the notification message payload.
    const payload = {
      notification: {
        title: `New Blood Request: ${requestBloodGroup}`,
        body: `A new request for ${requestBloodGroup} blood has been posted in ${requestState}. Tap to view.`,
        icon: "/favicon.ico",
        click_action: "https://van-rakshak-cm009.web.app/donate", // Directs user to the donate page
      },
    };

    // 5. Send the notification to all collected tokens.
    try {
      const response = await admin.messaging().sendToDevice(tokens, payload);
      console.log(
        "Successfully sent message:",
        response.successCount,
        "notifications.",
      );
    } catch (error) {
      console.log("Error sending message:", error);
    }

    return null;
  });