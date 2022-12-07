import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js';
import { getFirestore, addDoc, collection, query, where, getDocs, Timestamp } from 'https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyDNku8ZbdC04b5TGdFs8rP5_4FHBMGNMXU",
    authDomain: "finalchristmas-899d7.firebaseapp.com",
    projectId: "finalchristmas-899d7",
    storageBucket: "finalchristmas-899d7.appspot.com",
    messagingSenderId: "48030509492",
    appId: "1:48030509492:web:6e7b7454265301ce7feae1"
  };

const app = initializeApp(firebaseConfig);



// Setting up Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// When the sign-in button is clicked, the pop-up window will appear for users to sign in via Google.
signInBtn.onclick = () => signInWithPopup(auth, provider);

// When the sign-out button is clicked, the user is signed out and the page reloads.
signOutBtn.onclick = () => {
    signOut(auth, provider);
    location.reload()
}

// onAuthStateChanged detects if the user signs in or signs out. 
onAuthStateChanged(auth, (user) => {
    // user argument is null if a user signs out.
    if (user) {
        // If a user signs in:
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3>`;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
    }
});


// Setting up Firestore database
const db = getFirestore(app);

// This creates a reference to the collection of diary "entries" in your database.
let entryRef = collection(db, "entries")

const createPost = document.getElementById('createPost');
const entryList = document.getElementById('entryList');
const entryText = document.getElementById('entryText');


let findEntries  = async (user) => {

    const q = query(entryRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

    const items = querySnapshot.docs.map(doc => {
        return `<li>${user.displayName}: ${doc.data().entry}</li>`
    });
    


    entryList.innerHTML = items.join('');
}

let findAllEntries = async () => {
    const que = query(entryRef);
    const querySnapshotNew = await getDocs(que);

    querySnapshotNew.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });

    const allItems = querySnapshotNew.docs.map(doc => {
        return `<li>${doc.data().name}: ${doc.data().entry}</li>`
    });
    


    entryList.innerHTML = allItems.join('');

}

onAuthStateChanged(auth, (user) => {
    if (user) {

        findAllEntries()

        createPost.onclick = async () => {
            let timestamp = Timestamp.now()

            const newEntryRef = await addDoc(entryRef, {
                uid: user.uid,
                entry: entryText.value,
                timestamp: timestamp,
                name: user.displayName
              });

            console.log("Document written at", newEntryRef.timestamp);
            entryText.value = ""
            findEntries(user)
        }
    } 
});