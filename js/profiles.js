// js/profiles.js

import { Storage } from "./storage.js";

const Profiles = (() => {

  const listEl = document.getElementById("profilesList");
  const inputEl = document.getElementById("newProfileName");
  const createBtn = document.getElementById("createProfileBtn");

  let selectCallback = null;

  // ================= INIT =================
  function init() {
    render();

    createBtn.addEventListener("click", createProfile);
  }

  // ================= CREATE =================
  function createProfile() {
    const name = inputEl.value.trim();
    if (!name) {
      alert("اكتب اسم البروفايل");
      return;
    }

    const profiles = Storage.getProfiles();

    if (profiles.includes(name)) {
      alert("البروفايل ده موجود بالفعل");
      return;
    }

    Storage.addProfile(name);
    inputEl.value = "";
    render();
  }

  // ================= RENDER =================
  function render() {
    listEl.innerHTML = "";

    const profiles = Storage.getProfiles();

    if (profiles.length === 0) {
      listEl.innerHTML = "<p>مفيش بروفايلات لسه</p>";
      return;
    }

    profiles.forEach(name => {
      const div = document.createElement("div");
      div.className = "profile-item";
      div.textContent = name;

      div.onclick = () => {
        if (selectCallback) selectCallback(name);
      };

      listEl.appendChild(div);
    });
  }

  // ================= EVENTS =================
  function onSelect(cb) {
    selectCallback = cb;
  }

  return {
    init,
    onSelect,
  };

})();

export { Profiles };
