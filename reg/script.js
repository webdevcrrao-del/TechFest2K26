// ------------------ Firebase Import ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ------------------ Firebase Config ------------------
const firebaseConfig = {
  apiKey: "AIzaSyAXMe-TpFvw6X-ry43wdevjGHFrmldyiQA",
  authDomain: "chatbot-5ce023.firebaseapp.com",
  projectId: "chatbot-5ce023",
  storageBucket: "chatbot-5ce023.appspot.com",
  messagingSenderId: "1015838198134",
  appId: "1:1015838198134:web:93b33a69c2c44010309257"
};

// ------------------ Initialize Firebase ------------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Utility function → return "NA" if blank
function getValue(v) {
  return v && v.trim() !== "" ? v : "NA";
}

// ------------------ RENDER TEAM MEMBERS ------------------
window.renderMembers = function () {
  const size = document.getElementById("teamSize").value;
  const box = document.getElementById("teamMembers");
  box.innerHTML = "";

  for (let i = 1; i <= size; i++) {
    box.innerHTML += `
      <div class="member-box">
        <h3>Team Member ${i}</h3>

        <label>Name</label>
        <input type="text" class="m-name" required />

        <label>Email</label>
        <input type="email" class="m-email" required />

        <label>Phone</label>
        <input type="text" class="m-phone" required />
      </div>
    `;
  }
};

window.renderMembers();
document.getElementById("teamSize").addEventListener("change", renderMembers);

// ------------------ FORM SUBMIT ------------------
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  try {
    // ---------------- Personal ----------------
    const fullName = getValue(form.querySelectorAll("input[type='text']")[0].value);
    const email = getValue(form.querySelector("input[type='email']").value);
    const phone = getValue(form.querySelectorAll("input[type='text']")[1].value);

    // ---------------- Academic ----------------
    const college = getValue(form.querySelectorAll("input[type='text']")[2].value);
    const branch = getValue(form.querySelectorAll("select")[0].value);
    const year = getValue(form.querySelectorAll("select")[1].value);

    // ---------------- Team ----------------
    const teamName = getValue(form.querySelectorAll("input[type='text']")[3].value);
    const leaderGit = getValue(form.querySelectorAll("input[type='text']")[4].value);
    const teamSize = getValue(document.getElementById("teamSize").value);

    let teamMembers = [];
    const boxes = document.querySelectorAll(".member-box");

    boxes.forEach((box) => {
      teamMembers.push({
        memberName: getValue(box.querySelector(".m-name").value),
        memberEmail: getValue(box.querySelector(".m-email").value),
        memberPhone: getValue(box.querySelector(".m-phone").value),
      });
    });

    // ---------------- Skills ----------------
    const skills = getValue(form.querySelector("textarea").value);

    // ---------------- Logistics ----------------
    const accommodation = getValue(form.querySelectorAll("select")[2].value);
    const arrival = getValue(form.querySelector("input[type='datetime-local']").value);
    const food = getValue(form.querySelectorAll("select")[3].value);

    // ---------------- Additional Info ----------------
    const heardFrom = getValue(form.querySelectorAll("select")[4].value);
    const participatedBefore = getValue(form.querySelectorAll("select")[5].value);
    const tshirt = getValue(form.querySelectorAll("select")[6].value);

    // ---------------- Save in Firestore ----------------
    await addDoc(collection(db, "hackathon_registrations"), {
      timestamp: new Date(),

      personal: { fullName, email, phone },
      academic: { college, branch, year },

      team: { teamName, leaderGit, teamSize, teamMembers },

      skills,
      uploads: { 
        idCardURL: "NA", 
        resumeURL: "NA" 
      },

      logistics: { accommodation, arrival, food },

      additionalInfo: { heardFrom, participatedBefore, tshirt }
    });

    alert("🎉 Registration Submitted Successfully!");
    form.reset();
    renderMembers();

  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Error submitting form: " + error.message);
  }
});
