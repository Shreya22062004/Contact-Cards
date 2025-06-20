import React from "react";
import "./DetailsModal.css";

const DetailsModal = ({ contact, onClose }) => {
  if (!contact) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-avatar">
          {contact.avatar ? <img src={contact.avatar} alt="Avatar" /> : <span>{contact.name[0]}</span>}
        </div>
        <h2>{contact.name}</h2>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Phone:</strong> {contact.phone}</p>
        <div>
          <strong>Groups:</strong> {contact.groups && contact.groups.join(", ")}
        </div>
        <div>
          <strong>Favorite:</strong> {contact.favorite ? "★" : "☆"}
        </div>
        <div>
          <strong>Added:</strong> {new Date(contact.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};


export default DetailsModal;
