import admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Load service account key
const serviceAccount = require("backend/serviceAccountKey.json");

if (!getApps().length) {
	initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export const db = getFirestore();