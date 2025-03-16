import admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Load service account key
const serviceAccount = require("backend/serviceAccountKey.json");

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
}

export const db = admin.firestore();