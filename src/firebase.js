// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCFT7znSPkX8h-R9nthmQ8rsSV2A6UX9ZY",
    authDomain: "games-342c6.firebaseapp.com",
    projectId: "games-342c6",
    storageBucket: "games-342c6.appspot.com",
    messagingSenderId: "802210147307",
    appId: "1:802210147307:web:fe15c6d8c3e56948aa07ae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
