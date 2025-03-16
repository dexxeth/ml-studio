import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyAXuVV9U9HyrQvsDYj4GvNSFVgvmvn_Mj8",
	authDomain: "ml-studio-f9ccf.firebaseapp.com",
	projectId: "ml-studio-f9ccf",
	storageBucket: "ml-studio-f9ccf.firebasestorage.app",
	messagingSenderId: "246822710978",
	appId: "1:246822710978:web:a3ad9caa7394ee80eb555b",
	measurementId: "G-VGHM9TSY96",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { ref, getDownloadURL };