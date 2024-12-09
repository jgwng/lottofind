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
        schedule: "30 21 * * 6", // 9:05 PM every Saturday
        timeZone: "Asia/Seoul", // Korea Standard Time
    },
    async (event) => {
        try {
            const docRef = db.collection("lottoInfo").doc("drwNoInfo"); // Firestore document reference
            const doc = await docRef.get();

            if (!doc.exists) {
                console.error(`No document found for ID: drwNoInfo`);
                return;
            }

            // Get the current drwNo from the document
            const data = doc.data();
            const currentDrwNo = data.drwNo;

            if (!currentDrwNo) {
                console.error("drwNo is missing in the document");
                return;
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
                console.error("drwNo is missing in the lotto data");
                return;
            }

            console.log(`Using drwNo (${drwNo}) as the document ID`);

            // Save lotto data to Firestore with drwNo as the document name
            const lottoDocRef = db.collection("lottoInfo").doc(String(drwNo)); // Use drwNo as document ID
            await lottoDocRef.set({
                ...lottoData,
            });

            // Update the main document with the next draw number
            await docRef.update({
                drwNo: drwNo + 1, // Increment drwNo
            });

            console.log(`Lotto data saved successfully with document ID: ${drwNo}`);
        } catch (error) {
            console.error("Error in updateLottoData function:", error);
        }
    }
);