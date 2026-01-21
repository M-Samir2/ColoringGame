// js/app.js

import { Profiles } from "./profiles.js";
import { Storage } from "./storage.js";
import { Gallery } from "./gallery.js";
import { Editor } from "./editor.js";

document.addEventListener("DOMContentLoaded", () => {

  const screens = {
    profiles: document.getElementById("profilesScreen"),
    home: document.getElementById("homeScreen"),
    editor: document.getElementById("editorScreen"),
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
  }

  let currentProfile = null;

  // ================= PROFILES =================
  Profiles.onSelect(profileName => {
    currentProfile = profileName;
    document.getElementById("currentProfileName").textContent = profileName;
    Gallery.load(profileName);
    showScreen("home");
  });

  Profiles.init();

  // ================= HOME =================
  document.getElementById("changeProfileBtn").onclick = () => {
    showScreen("profiles");
  };

  document.getElementById("openBlankBtn").onclick = () => {
    Editor.openBlank(currentProfile);
    showScreen("editor");
  };

  document.getElementById("addImageBtn").onclick = () => {
    document.getElementById("imageInput").click();
  };

  document.getElementById("imageInput").onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    Gallery.addUserImage(currentProfile, file);
    e.target.value = "";
  };

  // ================= GALLERY =================
  Gallery.onOpenImage(src => {
    Editor.openImage(src, currentProfile);
    showScreen("editor");
  });

  // ================= EDITOR =================
  document.getElementById("backHomeBtn").onclick = () => {
    if (Editor.hasUnsavedChanges()) {
      if (!confirm("الخروج بدون حفظ؟")) return;
    }
    showScreen("home");
  };

  document.getElementById("saveBtn").onclick = () => Editor.save();
  document.getElementById("undoBtn").onclick = () => Editor.undo();
  document.getElementById("redoBtn").onclick = () => Editor.redo();

  document.getElementById("fullscreenBtn").onclick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  showScreen("profiles");
});
