const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const fetch = require("node-fetch"); // Import fetch for making API requests
const cors = require("cors")({ origin: true }); // Enable CORS for cross-origin requests

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a reference to Firestore
const db = admin.firestore();

exports.updateLottoData = onSchedule(
    {
        schedule: "every 5 minutes",
        timeZone: "Asia/Seoul", // Use the Asia/Seoul timezone
    },
    async (event) => {
        try {
            const docRef = db.collection("lottoInfo").doc('drwNoInfo'); // Replace 'users' with your Firestore collection name
            const doc = await docRef.get();

            if (!doc.exists) {
                console.error(`No document found for user ID: drwNoInfo`);
                return res.status(404).send("Document not found");
            }

            // Get the current drwNo from the document
            const data = doc.data();
            const currentDrwNo = data.drwNo;

            if (!currentDrwNo) {
                return res.status(400).send("drwNo is missing in the document");
            }

            // Fetch lotto data from external API
            console.log(`Fetching lotto data for draw number: ${currentDrwNo}`);
            const apiResponse = await fetch(
                `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${currentDrwNo}`
            );

            if (!apiResponse.ok) {
                throw new Error(`Failed to fetch lotto data: ${apiResponse.status}`);
            }

            const lottoData = await apiResponse.json();

            if (lottoData.returnValue !== "success") {
                throw new Error(`Invalid response from lotto API: ${lottoData.returnValue}`);
            }

            // Use drwNo as the document ID
            const { drwNo } = lottoData;

            if (!drwNo) {
                return res.status(400).send("drwNo is missing in the lotto data");
            }

            console.log(`Using drwNo (${drwNo}) as the document ID`);

            // Save lotto data to Firestore with drwNo as the document name
            const lottoDocRef = db.collection("lottoInfo").doc(String(drwNo)); // Use drwNo as document ID
            await lottoDocRef.set({
                ...lottoData,
            });

            // Optionally, update the user's document with the next draw number
            await docRef.update({
                drwNo: drwNo + 1, // Increment drwNo
            });

            res.status(200).send({
                message: `Lotto data saved successfully with document ID: ${drwNo}`,
                savedData: {
                    ...lottoData,
                },
            });
        } catch (error) {
            console.error("Error processing request:", error);
            res.status(500).send("Internal Server Error");
        }
    }
);