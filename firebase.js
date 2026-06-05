
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore,collection,addDoc,getDocs,deleteDoc,doc,updateDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyBR7tqs0tGxC_F7N1-MiiIdXFcGu_QjJbs",authDomain:"fares-png.firebaseapp.com",projectId:"fares-png",storageBucket:"fares-png.firebasestorage.app",messagingSenderId:"614335638714",appId:"1:614335638714:web:2beb94f0041b69c6dca683"};
const app=initializeApp(firebaseConfig);
window.db=getFirestore(app);
window.collection=collection;window.addDoc=addDoc;window.getDocs=getDocs;window.deleteDoc=deleteDoc;window.doc=doc;window.updateDoc=updateDoc;
