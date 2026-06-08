import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/profile.css";

export default function UserProfile() {
  const { user, updateProfile, changePassword, error, setError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("profile");

  // Profile form
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const result = await updateProfile(profileData.name, profileData.phone, profileData.address);

    if (result.success) {
      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    if (result.success) {
      setSuccessMessage("Password berhasil diubah!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setTimeout(() => setSuccessMessage(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profil Saya</h2>

        {error && <div className="profile-error">{error}</div>}
        {successMessage && <div className="profile-success">{successMessage}</div>}

        <div className="profile-tabs">
          <button
            className={`tab-btn ${tab === "profile" ? "active" : ""}`}
            onClick={() => setTab("profile")}
          >
            Informasi Profil
          </button>
          <button
            className={`tab-btn ${tab === "password" ? "active" : ""}`}
            onClick={() => setTab("password")}
          >
            Ubah Password
          </button>
        </div>

        {tab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ""} disabled />
            </div>

            <div className="form-group">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Alamat</label>
              <textarea
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleProfileChange}
                rows="4"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={handleChangePassword} className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Password Saat Ini</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Password Baru</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Mengubah..." : "Ubah Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
