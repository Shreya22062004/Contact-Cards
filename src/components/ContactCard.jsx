import React from "react";
import "./ContactCard.css";

const ContactCard = ({
  name,
  email,
  phone,
  avatar,
  groups,
  favorite,
  onDelete,
  onEdit,
  onDuplicate,
  onFavorite,
  onShowDetails,
}) => (
  <div className="contact-card">
    <div className="card-avatar" onClick={onShowDetails} style={{ cursor: "pointer" }}>
      {avatar ? (
        <img src={avatar} alt="Avatar" />
      ) : (
        <span>{name ? name[0].toUpperCase() : "?"}</span>
      )}
    </div>
    <div className="card-details">
      <h3>
        {name}
        <button
          className="star-btn"
          title={favorite ? "Unfavorite" : "Favorite"}
          onClick={onFavorite}
        >
          {favorite ? "★" : "☆"}
        </button>
      </h3>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Phone:</strong> {phone}
      </p>
      <div>
        {groups && groups.map((g) => (
          <span key={g} className="group-badge">
            {g}
          </span>
        ))}
      </div>
      <div className="card-actions">
        <button onClick={onEdit} className="edit-btn">
          Edit
        </button>
        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
        <button onClick={onDuplicate} className="duplicate-btn">
          Duplicate
        </button>
        <button onClick={onShowDetails} className="details-btn">
          Details
        </button>
      </div>
    </div>
  </div>
);

export default ContactCard;
