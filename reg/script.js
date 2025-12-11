// ------------------ Firebase Import ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
const storage = getStorage(app);

// Utility function → return "NA" if blank
function getValue(v) {
  return v && v.trim() !== "" ? v : "NA";
}

// Upload file to Firebase Storage
async function uploadFile(file, path) {
  if (!file) return "NA";

  console.log("Uploading file to:", path);

  try {
    const storageRef = ref(storage, path);
    console.log("Storage ref created:", storageRef);

    const snapshot = await uploadBytes(storageRef, file);
    console.log("Upload complete:", snapshot);

    const url = await getDownloadURL(storageRef);
    console.log("Download URL:", url);

    return url;

  } catch (err) {
    console.error("🔥 UPLOAD ERROR:", err);
    alert("Upload failed: " + err.message);
    return "NA";
  }
}



// Render Team Members UI
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

    // Collect team members
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

    // ---------------- Uploads ----------------
    const fileInputs = form.querySelectorAll("input[type='file']");
    const idCardFile = fileInputs[0].files[0];
    const resumeFile = fileInputs[1].files[0];

    const idCardURL = await uploadFile(idCardFile, `idcards/${teamName}_${Date.now()}`);
    const resumeURL = await uploadFile(resumeFile, `resumes/${teamName}_${Date.now()}`);

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
      uploads: { idCardURL, resumeURL },

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
