/* =====================================================
   STORAGE.JS
   إدارة LocalStorage
   - Profiles
   - Images
   - Albums
   - Rename / Delete
===================================================== */

const Storage = (() => {

  const PROFILES_KEY = "coloring_profiles";

  /* ================= PROFILES ================= */

  function getProfiles() {
    return JSON.parse(localStorage.getItem(PROFILES_KEY) || "[]");
  }

  function saveProfiles(list) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  }

  function createProfile(name) {
    name = name.trim();
    if (!name) return false;

    const profiles = getProfiles();
    if (profiles.includes(name)) return false;

    profiles.push(name);
    saveProfiles(profiles);

    localStorage.setItem(profileKey(name), JSON.stringify({
      images: [],
      album: []
    }));

    return true;
  }

  function deleteProfile(name) {
    let profiles = getProfiles();
    profiles = profiles.filter(p => p !== name);
    saveProfiles(profiles);

    localStorage.removeItem(profileKey(name));
  }

  function renameProfile(oldName, newName) {
    newName = newName.trim();
    if (!newName) return false;

    const profiles = getProfiles();
    if (!profiles.includes(oldName)) return false;
    if (profiles.includes(newName)) return false;

    // نقل البيانات
    const data = getProfileData(oldName);

    // تحديث القائمة
    const updated = profiles.map(p => p === oldName ? newName : p);
    saveProfiles(updated);

    // حذف القديم وإنشاء الجديد
    localStorage.removeItem(profileKey(oldName));
    localStorage.setItem(profileKey(newName), JSON.stringify(data));

    return true;
  }

  /* ================= PROFILE DATA ================= */

  function profileKey(name) {
    return "profile_" + name;
  }

  function getProfileData(name) {
    return JSON.parse(
      localStorage.getItem(profileKey(name)) ||
      JSON.stringify({ images: [], album: [] })
    );
  }

  function saveProfileData(name, data) {
    localStorage.setItem(profileKey(name), JSON.stringify(data));
  }

  /* ================= IMAGES ================= */

  function addImageToProfile(name, svgText) {
    const data = getProfileData(name);
    data.images.push(svgText);
    saveProfileData(name, data);
  }

  function saveToAlbum(name, svgText) {
    const data = getProfileData(name);
    data.album.push(svgText);
    saveProfileData(name, data);
  }

  /* ================= PUBLIC API ================= */

  return {
    // profiles
    getProfiles,
    createProfile,
    deleteProfile,
    renameProfile,

    // data
    getProfileData,
    saveProfileData,

    // images
    addImageToProfile,
    saveToAlbum
  };

})();
