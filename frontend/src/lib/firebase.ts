import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCz0eDeSkF1VSrxX5QQPCVNlubSAZvJby4",
  authDomain: "jadu-the-vayusync.firebaseapp.com",
  databaseURL: "https://jadu-the-vayusync-default-rtdb.firebaseio.com",
  projectId: "jadu-the-vayusync",
  storageBucket: "jadu-the-vayusync.firebasestorage.app",
  messagingSenderId: "868066841392",
  appId: "1:868066841392:web:5591b567a704b3472deef5",
  measurementId: "G-0JG7D9JG9N"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;