import React, { useState, useEffect } from "react";
import ContactForm from "./components/ContactForm";
import UserList from "./components/UserList";
import SearchBar from "./components/SearchBar";
import Notification from "./components/Notification";
import DetailsModal from "./components/DetailsModal";
import "./App.css";

const STORAGE_KEY = "contact-cards-users";
const GROUPS = ["Family", "Work", "Friends", "Other"];

function sortContacts(contacts, sortBy, sortOrder) {
  let sorted = [...contacts];
  if (sortBy === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "createdAt") {
    sorted.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sortBy === "favorite") {
    sorted.sort((a, b) => (b.favorite === b.favorite ? 0 : b.favorite ? -1 : 1));
  }
  if (sortOrder === "desc") sorted.reverse();
  return sorted;
}

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingIdx, setEditingIdx] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterGroup, setFilterGroup] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [modalContact, setModalContact] = useState(null);
  const [sortGroup, setSortGroup] = useState("");


  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUsers(JSON.parse(saved));
  }, []);

  // Save to localStorage on users change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => setNotification({ message: "", type: "" }), 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Add, Edit, Delete
  const addUser = (user) => {
    setUsers([
      {
        ...user,
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        createdAt: Date.now(),
      },
      ...users,
    ]);
    setNotification({ message: "Contact added!", type: "success" });
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setEditingIdx(null);
    setNotification({ message: "Contact deleted!", type: "error" });
  };

  const startEditUser = (id) => setEditingIdx(id);

  const updateUser = (updatedUser) => {
    setUsers(users.map((user) =>
      user.id === editingIdx ? { ...user, ...updatedUser } : user
    ));
    setEditingIdx(null);
    setNotification({ message: "Contact updated!", type: "success" });
  };

  const cancelEdit = () => setEditingIdx(null);

  const duplicateUser = (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newUser = {
      ...user,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: user.name + " (Copy)",
      createdAt: Date.now(),
    };
    setUsers([newUser, ...users]);
    setNotification({ message: "Contact duplicated!", type: "success" });
  };

  // Favourite toggle by id
  const toggleFavorite = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, favorite: !user.favorite } : user
      )
    );
  };

  // Group filter
  const handleGroupFilter = (e) => setSortGroup(e.target.value);

  // Favourites filter
  const handleShowFavorites = () => setShowFavorites((f) => !f);

  // Search, group, and favourites filtering
  let filteredUsers = users;
  if (showFavorites) filteredUsers = filteredUsers.filter((u) => u.favorite);
  if (sortGroup) filteredUsers = filteredUsers.filter((u) => u.groups && u.groups.includes(sortGroup));
  if (searchTerm) filteredUsers = filteredUsers.filter((u) =>
    [u.name, u.email].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting
  const handleSort = (e) => setSortBy(e.target.value);
  const handleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  // Modal
  const openModal = (id) => {
    const contact = users.find((u) => u.id === id);
    setModalContact(contact || null);
  };
  const closeModal = () => setModalContact(null);

  filteredUsers = sortContacts(filteredUsers, sortBy, sortOrder);

  return (
    <div className="app-container">
      <h1>Contact Cards</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <select value={sortBy} onChange={handleSort}>
          <option value="createdAt">Recently Added</option>
          <option value="name">Name</option>
          <option value="favorite">Favorites First</option>
        </select>
        <button onClick={handleSortOrder}>Sort: {sortOrder === "asc" ? "↑" : "↓"}</button>
        <select value={filterGroup} onChange={handleGroupFilter}>
          <option value="">All Groups</option>
          {GROUPS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button onClick={() => setShowFavorites((f) => !f)}>
          {showFavorites ? "Show All" : "Show Favorites"}
        </button>
      </div>
      <ContactForm
        onAdd={addUser}
        onUpdate={updateUser}
        editingContact={editingIdx ? users.find((u) => u.id === editingIdx) : null}
        cancelEdit={cancelEdit}
        groups={GROUPS}
      />
      <UserList
        users={filteredUsers}
        onDelete={deleteUser}
        onEdit={startEditUser}
        onDuplicate={duplicateUser}
        onFavorite={toggleFavorite}
        onShowDetails={openModal}
      />
      <Notification message={notification.message} type={notification.type} />
      {modalContact && <DetailsModal contact={modalContact} onClose={closeModal} />}
    </div>
  );
};

export default App;
