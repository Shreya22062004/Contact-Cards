import React from "react";
import ContactCard from "./ContactCard";
import "./UserList.css";

const UserList = ({
  users,
  onDelete,
  onEdit,
  onDuplicate,
  onFavorite,
  onShowDetails,
}) => (
  <div className="user-list">
    {users.length === 0 ? (
      <p className="no-contacts">No contacts yet. Add one!</p>
    ) : (
      users.map((user) => (
        <ContactCard
          key={user.id}
          {...user}
          onDelete={() => onDelete(user.id)}
          onEdit={() => onEdit(user.id)}
          onDuplicate={() => onDuplicate(user.id)}
          onFavorite={() => onFavorite(user.id)}
          onShowDetails={() => onShowDetails(user.id)}
        />
      ))
    )}
  </div>
);

export default UserList;

