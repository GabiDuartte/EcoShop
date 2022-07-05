import{initializeApp} from 'firebase/app'
import {
  getFirestore, collection
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAawK8KxTJvThuhGFZrujgmbCzPCp46ruo",
  authDomain: "ecoshop-c2160.firebaseapp.com",
  projectId: "ecoshop-c2160",
  storageBucket: "ecoshop-c2160.appspot.com",
  messagingSenderId: "76320272683",
  appId: "1:76320272683:web:ae865c6fa6633c4691d56e",
  measurementId: "G-3XDG3BJLFT"
}

initializeApp(firebaseConfig)

const db = getFirestore()

const colRef = collection(db, 'usuarios')

getDocs(colRef)
.then((snapshot) => {
  console.log(snapshot.docs)
})



