import React, { useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./AuthForm.css";

function AuthForm({ setUser, onAdminLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = `${username}@fake.com`; // Dummy email for Firebase

    try {
      let userCredential;

	if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          username: username,
          score: 0,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        const currentData = userSnap.data() || {};
        const currentUsername = currentData.username || username;

        await setDoc(userRef, {
          username: currentUsername,
        }, { merge: true });
      }
     if (username === "loganbeach11" && password === "1@mAwe$0me!") {
        onAdminLogin();
      }

      setUser(userCredential.user); // ✅ Pass full user object
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication failed: " + err.message);
    }
  };

    return (
      <div className="page-wrapper">
      <div className="auth-form-container">
          <h2>{isRegistering ? "Register" : "Login"}</h2>
	  <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {isRegistering ? "Create Account" : "Log In"}
          </button>
          </form>
 	  <p>
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <span className="auth-toggle" onClick={() => setIsRegistering(false)}>
                Login
              </span>
            </>
          ) : (
            <>
              Need an account?{" "}
              <span className="auth-toggle" onClick={() => setIsRegistering(true)}>
                Register
              </span>
            </>
          )}
        </p>
      </div>
	</div>
  );
}

export default AuthForm;
