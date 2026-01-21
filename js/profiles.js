/* =====================================================
   PROFILES.JS
   - UI Logic للبروفايلات
   - Create / Rename / Delete / Select
===================================================== */

let currentProfile = null;

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  renderProfiles();
});

/* ================= RENDER ================= */

function renderProfiles() {
  const list = document.getElementById("profilesList");
  list.innerHTML = "";

  const profiles = Storage.getProfiles();

  profiles.forEach(name => {
    const item = document.createElement("div");
    item.className = "profile-item";

    const title = document.createElement("span");
    title.textContent = name;
    title.onclick = () => selectProfile(name);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => renameProfileUI(name);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => deleteProfileUI(name);

    item.append(title, editBtn, deleteBtn);
    list.appendChild(item);
  });
}

/* ================= ACTIONS ================= */

function createProfileUI() {
  const name = prompt("اسم البروفايل:");
  if (!name) return;

  if (!Storage.createProfile(name)) {
    alert("الاسم مستخدم أو غير صالح");
    return;
  }

  renderProfiles();
}

function deleteProfileUI(name) {
  if (!confirm(`حذف بروفايل "${name}"؟`)) return;

  Storage.deleteProfile(name);

  if (currentProfile === name) {
    currentProfile = null;
    localStorage.removeItem("activeProfile");
  }

  renderProfiles();
}

function renameProfileUI(oldName) {
  const newName = prompt("اسم جديد:", oldName);
  if (!newName || newName === oldName) return;

  if (!Storage.renameProfile(oldName, newName)) {
    alert("الاسم غير صالح أو مستخدم");
    return;
  }

  if (currentProfile === oldName) {
    currentProfile = newName;
    localStorage.setItem("activeProfile", newName);
  }

  renderProfiles();
}

/* ================= SELECT ================= */

function selectProfile(name) {
  currentProfile = name;
  localStorage.setItem("activeProfile", name);

  document.getElementById("currentProfileName").textContent = name;

  // هنا بعد كده هننادي:
  // loadProfileImages(name)
}

/* ================= HELPERS ================= */

function getActiveProfile() {
  if (currentProfile) return currentProfile;

  const saved = localStorage.getItem("activeProfile");
  if (saved) {
    currentProfile = saved;
    return saved;
  }

  return null;
}
