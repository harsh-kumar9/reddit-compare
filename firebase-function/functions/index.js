const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Enable CORS

admin.initializeApp();
const db = admin.firestore();

exports.submitData = functions.https.onRequest((req, res) => {
    cors(req, res, async () => { // Wrap with CORS
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        try {
            await db.collection("experiment_data").add(req.body);
            res.status(200).json({ message: "Data stored successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});
