
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getDatabase, ref, set, update, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSWywTzw0j09VXkLJlqpREKJg8sqz4agk",
  authDomain: "triplex-8896e.firebaseapp.com",
  projectId: "triplex-8896e",
  storageBucket: "triplex-8896e.appspot.com",
  messagingSenderId: "761984200862",
  appId: "1:761984200862:web:6eccc05c6e749ff22b8b8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase();

// Function to create a new user with email and password
export async function signUpWithEmailAndPassword(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Write user information to the database
    await writeUserData(user.uid, email, username);
    return user;
  } catch (error) {
    console.error("Error signing up with email and password:", error);
    throw error;
  }
}

// Function to sign in a user with email and password
export async function signInWithEmailPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
}

// Function to sign in (or sign up) a user with a Google account
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    // Check if the user already exists in the database and write their information if not
    const userExists = await checkUserExists(user.uid);
    if (!userExists) {
      await writeUserData(user.uid, user.email, user.displayName);
    }
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export function signOut() {
  auth.signOut();
}

export async function getUsername(userId) {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      return snapshot.val().username;
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error getting username:', error);
    throw error;
  }
}



// Function to check if a user exists in the database
async function checkUserExists(userId) {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  return snapshot.exists();
}

// Function to write user data to the database
async function writeUserData(userId, email, username) {
  const userRef = ref(database, `users/${userId}`);
  await set(userRef, { email, username });
}

// Function to update a user's score for a game
export async function updateScore(userId, game, score) {
  const scoreRef = ref(database, `scores/${userId}/${game}`);
  await update(scoreRef, { score });
}

// Function to get the score of a user for a certain game
export async function getUserScore(userId, game) {
  try {
    const scoreRef = ref(database, `scores/${userId}/${game}`);
    const snapshot = await get(scoreRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No score data found for the user and the game');
      return null;
    }
  } catch (error) {
    console.error('Error getting user score:', error);
    throw error;
  }
}