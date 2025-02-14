const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.submitData = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    try {
        await db.collection("experiment_data").add(req.body);
        res.status(200).send({ message: "Data stored successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
