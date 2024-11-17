import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    setDoc,
    doc,
    updateDoc,
    query,
    where,
  } from "firebase/firestore";
const firebaseApiKey = import.meta.env.VITE_SECURE_API_KEY;
const firebaseAuthDomain = import.meta.env.VITE_SECURE_AUTH_DOMAIN;
const firebaseProjectId = import.meta.env.VITE_SECURE_PROJECT_ID;
const firebaseStorageBucket = import.meta.env.VITE_SECURE_STORAGE_BUCKET;
const firebaseMessagingSenderID = import.meta.env.VITE_SECURE_MESSAGING_ID;
const firebaseAppId = import.meta.env.VITE_SECURE_APP_ID;

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: firebaseAuthDomain,
    projectId: firebaseProjectId,
    storageBucket: firebaseStorageBucket,
    messagingSenderId: firebaseMessagingSenderID,
    appId: firebaseAppId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function uploadSidoData() {
  try {
    // Fetch the JSON data
    const response = await fetch(`/data/전국.json`);
    if (!response.ok) {
      throw new Error(`Could not fetch 전국.json: ${response.statusText}`);
    }
    const data = await response.json();

    // Extract cortarNo values into a list
    const cortarNoList = data.regionList.map(region => region.cortarNo);
    const cortarNameList = data.regionList.map(region => region.cortarName);
    const centerLatList = data.regionList.map(region => region.centerLat);
    const centerLonList = data.regionList.map(region => region.centerLon);
    // Create a document reference for the `sido` collection with a fixed ID
    const regionRef = doc(collection(db, "sido"), "0000000000");

    // Write the list of cortarNo to Firestore
    await setDoc(regionRef, {
      regionList: cortarNameList,
      cortarList: cortarNoList,
      centerLatList: centerLatList,
      centerLonList: centerLonList
    });

    console.log(`Uploaded cortarNo list to Firestore:`, cortarNoList);
    return cortarNoList;
  } catch (error) {
    console.error("Error uploading data:", error);
    return null;
  }
}

export async function uploadData() {
    try {
      const response = await fetch(`/data/전국.json`);
      if (!response.ok) {
        throw new Error(`Could not fetch 전국.json: ${response.statusText}`);
      }
      const data = await response.json();
      await uploadRegions(data);
      for (const region of data.regionList){
        const result = await fetch(`/data/sido_${region.cortarName}.json`);
        const resultData = await result.json();
        await uploadSubregions(region.cortarNo,resultData);
        for (const subRegion of resultData.regionList){
            console.log(`SUBSUBsubregion: ${region.cortarName}_${subRegion.cortarName}`);
            const subResult = await fetch(`/data/${region.cortarName}_${subRegion.cortarName}.json`);
            const subResultData = await subResult.json();
            await addSubSubregion(region.cortarNo,subRegion.cortarNo,subResultData);
          }
      }
      console.log(`Fetched data from 전국.json:`, data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

export async function uploadRegions(regionData) {
    try {
      // Loop through each region in the main region data (전국.json)
      for (const region of regionData.regionList) {
        // Create a document reference with a custom ID based on cortarNo
        const regionRef = doc(collection(db, "sido"), region.cortarNo);
        
        // Set the region data (excluding cortarNo since it's used as the ID)
        await setDoc(regionRef, {
          cortarName: region.cortarName,
          cortarType: region.cortarType,
          centerLat: region.centerLat,
          centerLon: region.centerLon
        });
  
        console.log(`Uploaded region: ${region.cortarName}`);
      }
    } catch (error) {
      console.error("Error uploading regions:", error);
    }
  }
  
  export async function uploadSubregions(regionId, subregionData) {
    try {
      const subregionsRef = collection(db, `sido/${regionId}/region`);
      const regionRef = doc(collection(db, "sido"), regionId);
  
      const regionList = [];
      const cortarList = [];
      const centerLatList = [];
      const centerLonList = [];

      // Loop through each subregion in the data
      for (const subregion of subregionData.regionList) {
        // Create a document reference with a custom ID based on cortarNo
        const subregionDocRef = doc(subregionsRef, subregion.cortarNo);
  
        // Set the subregion data
        await setDoc(subregionDocRef, {
          cortarName: subregion.cortarName,
          cortarType: subregion.cortarType,
          centerLat: subregion.centerLat,
          centerLon: subregion.centerLon
        });
  
        // console.log(`Uploaded subregion: ${subregion.cortarName}`);
  
        // Collect data for regionList and cortarList
        regionList.push(subregion.cortarName);
        cortarList.push(subregion.cortarNo);
        centerLatList.push(subregion.centerLat);
        centerLonList.push(subregion.centerLon);
      }
  
      // Add or update the regionRef with regionList and cortarList
      await updateDoc(regionRef, {
        regionList: regionList,
        cortarList: cortarList,
        centerLatList: centerLatList,
        centerLonList: centerLonList,
      });
  
      console.log(`Updated regionRef with regionList and cortarList.`);
    } catch (error) {
      console.error("Error uploading subregions:", error);
    }
  }
  export async function addSubSubregion(regionId, subregionId, subSubregionData) {
    try {
      const subSubregionsRef = collection(db, `sido/${regionId}/region/${subregionId}/city`);
      const subregionRef = doc(collection(db, `sido/${regionId}/region`), subregionId);
  
      const regionList = [];
      const cortarList = [];
      const centerLatList = [];
      const centerLonList = [];

      // Loop through each sub-subregion in the data
      for (const subsubregion of subSubregionData.regionList) {
        const subSubregionId = subsubregion.cortarNo; // Use cortarNo as the unique identifier
        const subSubregionDocRef = doc(subSubregionsRef, subSubregionId);
  
        // Set the sub-subregion data
        await setDoc(subSubregionDocRef, {
          cortarName: subsubregion.cortarName,
          cortarType: subsubregion.cortarType,
          centerLat: subsubregion.centerLat,
          centerLon: subsubregion.centerLon
        });
  
        console.log(`Uploaded sub-subregion: ${subsubregion.cortarName}`);
  
        // Collect data for regionList and cortarList
        regionList.push(subsubregion.cortarName);
        cortarList.push(subsubregion.cortarNo);
        centerLatList.push(subsubregion.centerLat);
        centerLonList.push(subsubregion.centerLon);
      }
  
      // Add or update the subregionRef with regionList and cortarList
      await updateDoc(subregionRef, {
        regionList: regionList,
        cortarList: cortarList,
        centerLatList: centerLatList,
        centerLonList: centerLonList,
      });
  
      console.log(`Updated subregionRef with regionList and cortarList for subregion ${subregionId}.`);
    } catch (error) {
      console.error("Error adding sub-subregion:", error);
    }
  }
  
  export async function getSidoData (directory,isSeveral) {
    if(isSeveral){
      return await getDocs(collection(db, directory));
    }else{
      return await getDoc(doc(db, directory));
    }
  }

export { db };



