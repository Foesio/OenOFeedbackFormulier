// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { increment } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyVSHkR8rQnYsCM_We-Dhy1rSZpGX_bX8",
  authDomain: "oeno-feedbackformulier.firebaseapp.com",
  projectId: "oeno-feedbackformulier",
  storageBucket: "oeno-feedbackformulier.firebasestorage.app",
  messagingSenderId: "499785509127",
  appId: "1:499785509127:web:027ca608a4d115716fbda2",
  measurementId: "G-NB35TS1SXF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let db; // Declare db outside the initialization function

async function initializeFirestore() {
  db = getFirestore(app); // Initialize Firestore here
  // Assuming you have already initialized Firebase and have a 'db' instance
  //const db = getFirestore();

  async function updateAanbevelen(aanbevelen, ervaring, netheid, openingstijden, personeel, snelheid, vinden, volgendeBezoek, totaalAntwoorden) {
    try {
      const feedbackRef = doc(db, "OenOFeedback", "OenOFeedback");
  
      await updateDoc(feedbackRef, {
        aanbevelen: increment(aanbevelen),
        ervaring: increment(ervaring),
        netheid: increment(netheid),
        openingstijden: increment(openingstijden),
        personeel: increment(personeel),
        snelheid: increment(snelheid),
        vinden: increment(vinden),
        volgendeBezoek: increment(volgendeBezoek),
        totaalAntwoorden: increment(totaalAntwoorden)
      });
  
      console.log("Document updated (optelling)!");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  

  document.getElementById("verstuur").addEventListener("click", function() {
      const ratings = document.querySelectorAll('.rating');
      let ratingValues = {};
  
      ratings.forEach(rating => {
        const vraagNaam = rating.getAttribute('data-vraag');
        const geselecteerde = rating.querySelector(`input[name="${vraagNaam}"]:checked`);
  
        if (geselecteerde) {
          ratingValues[vraagNaam] = parseInt(geselecteerde.value);
        } else {
          ratingValues[vraagNaam] = 3; // Of 3 als er niks is aangeklikt
        }
      });
  
      // Roep de functie aan met de juiste volgorde van waarden
      updateAanbevelen(
        ratingValues['aanbevelen'],
        ratingValues['ervaring'],
        ratingValues['netheid'],
        ratingValues['openingstijden'],
        ratingValues['personeel'],
        ratingValues['snelheid'],
        ratingValues['vinden'],
        ratingValues['volgendeBezoek'],
        1
      );
      setTimeout(() => {
        haalFeedbackOp();
        window.location.href = "bedankt.html";
      }, 1000);
    
  });
}

initializeFirestore();

async function haalFeedbackOp() {
  const feedbackRef = doc(db, "OenOFeedback", "OenOFeedback");
  const feedbackSnap = await getDoc(feedbackRef);

  if (feedbackSnap.exists()) {
    const data = feedbackSnap.data();
    const aanbevelingGem = data.aanbevelen / data.totaalAntwoorden;
    const ervaringGem = data.ervaring / data.totaalAntwoorden;
    const netheidGem = data.netheid / data.totaalAntwoorden;
    const openingstijdenGem = data.openingstijden / data.totaalAntwoorden;
    const personeelGem = data.personeel / data.totaalAntwoorden;
    const snelheidGem = data.snelheid / data.totaalAntwoorden;
    const vindenGem = data.vinden / data.totaalAntwoorden;
    const volgendeBezoekGem = data.volgendeBezoek / data.totaalAntwoorden;
  } else {
    console.log("Document bestaat niet!");
  }
}
