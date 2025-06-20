import React, { useState, useEffect } from "react";
import "./ContactForm.css";

const initialState = { name: "", email: "", phone: "", avatar: "", groups: [] };

// Validation functions
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Simple, robust[20][21]
const validatePhone = (phone) =>
  /^(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4,6}$/.test(phone); // Accepts most formats[18][19]

const ContactForm = ({ onAdd, onUpdate, editingContact, cancelEdit, groups }) => {
  const [form, setForm] = useState(initialState);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingContact) {
      setForm(editingContact);
      setAvatarPreview(editingContact.avatar || "");
    } else {
      setForm(initialState);
      setAvatarPreview("");
    }
    setErrors({});
  }, [editingContact]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result });
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGroupChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({
      ...f,
      groups: f.groups.includes(value)
        ? f.groups.filter((g) => g !== value)
        : [...f.groups, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!validateEmail(form.email)) newErrors.email = "Invalid email format.";
    if (!form.phone) newErrors.phone = "Phone number is required.";
    else if (!validatePhone(form.phone)) newErrors.phone = "Invalid phone number format.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (editingContact) {
      onUpdate(form);
    } else {
      onAdd(form);
    }
    setForm(initialState);
    setAvatarPreview("");
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="avatar-upload">
        <label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <div className="avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" />
            ) : (
              <span className="avatar-placeholder">
                {form.name ? form.name[0].toUpperCase() : "?"}
              </span>
            )}
          </div>
          <span className="avatar-upload-btn">
            {avatarPreview ? "Change" : "Upload"} Avatar
          </span>
        </label>
      </div>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      {errors.name && <div className="form-error">{errors.name}</div>}
      <input
        name="email"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      {errors.email && <div className="form-error">{errors.email}</div>}
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        required
      />
      {errors.phone && <div className="form-error">{errors.phone}</div>}
      <div className="group-select">
        <span>Groups:</span>
        {groups &&
          groups.map((g) => (
            <label key={g}>
              <input
                type="checkbox"
                value={g}
                checked={form.groups.includes(g)}
                onChange={handleGroupChange}
              />
              {g}
            </label>
          ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="submit">{editingContact ? "Update" : "Add Contact"}</button>
        {editingContact && (
          <button type="button" onClick={cancelEdit} style={{ background: "#bbb" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
