// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC3RxWm89-9hmRrKPaD3pUZV00L0pM9CTE',
  authDomain: 'hashtag-picker.firebaseapp.com',
  databaseURL:
    'https://hashtag-picker-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'hashtag-picker',
  storageBucket: 'hashtag-picker.appspot.com',
  messagingSenderId: '572042117355',
  appId: '1:572042117355:web:63633adf6836bac69abeae',
  measurementId: 'G-3EKL5SNSY1',
};

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
};
