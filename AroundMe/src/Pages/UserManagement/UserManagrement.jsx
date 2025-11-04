import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Mail,
  Phone,
  Eye,
  Edit,
  CheckCircle,
  MoreHorizontal,
  Save,
  XCircle,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", { withCredentials: true })
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data)) {
          setUsers(res.data.data);
        } else if (Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.error("Unexpected API response format:", res.data);
          setUsers([]);
        }
      })
      .catch((err) => console.error("❌ Error fetching users:", err));
  }, []);

  // ✅ Filter logic
  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesSearch =
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
    : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge badge-active">Active</span>;
      case "suspended":
        return <span className="badge badge-suspended">Suspended</span>;
      default:
        return <span className="badge badge-default">Unknown</span>;
    }
  };

  // ✅ Suspend user
  const handleSuspend = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/users/${userId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (res.status === 200) alert("User suspended!");
    } catch (err) {
      console.error("❌ Error suspending user:", err);
      alert("Error suspending user.");
    }
  };

  // ✅ Activate user
  const handleActivate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/users/${userId}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (res.status === 200) alert("User activated!");
    } catch (err) {
      console.error("❌ Error activating user:", err);
      alert("Error activating user.");
    }
  };

  // ✅ Update role
  const handleSaveRole = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:3000/users/role/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (res.status === 200) {
        alert("Role updated successfully!");
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setEditingUserId(null);
      }
    } catch (err) {
      console.error("❌ Error updating role:", err);
      alert("Error updating role.");
    }
  };

  return (
    <div className="user-page">
      <div className="header">
        <h1>User Management</h1>
        <p>Manage user roles, status, and permissions</p>
      </div>

      {/* 🔍 Filters */}
      <div className="filters">
        <div className="search-box">
          <Search className="icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="event_manager">Event Manager</option>
          <option value="member">Member</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    {user.name}{" "}
                    {user.verified && (
                      <CheckCircle size={14} className="verified-icon" />
                    )}
                  </td>
                  <td>
                    <p><Mail size={14} /> {user.email}</p>
                    <p><Phone size={14} /> {user.mobile || "—"}</p>
                  </td>

                  {/* Editable Role */}
                  <td>
                    {editingUserId === user._id ? (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                        <option value="event_manager">Event Manager</option>
                        <option value="member">Member</option>
                      </select>
                    ) : (
                      <span>{user.role}</span>
                    )}
                  </td>

                  <td>{user.joinDate || "N/A"}</td>
                  <td>{getStatusBadge(user.status)}</td>

                  <td>
                    <div className="action-btns">
                      {editingUserId === user._id ? (
                        <>
                          <button
                            className="icon-btn save"
                            onClick={() => handleSaveRole(user._id)}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            className="icon-btn cancel"
                            onClick={() => setEditingUserId(null)}
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="icon-btn edit"
                          onClick={() => {
                            setEditingUserId(user._id);
                            setNewRole(user.role);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      )}

                      {user.status === "suspended" ? (
                        <button
                          className="icon-btn activate"
                          onClick={() => handleActivate(user._id)}
                        >
                          <UserCheck size={16} />
                        </button>
                      ) : (
                        <button
                          className="icon-btn suspend"
                          onClick={() => handleSuspend(user._id)}
                        >
                          <UserX size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
