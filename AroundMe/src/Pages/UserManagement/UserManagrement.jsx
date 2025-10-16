import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserManagement.css";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Mail,
  Phone,
  Ban,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Fetch users from backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/users") 
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  // ✅ Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge badge-active">Active</span>;
      case "suspended":
        return <span className="badge badge-suspended">Suspended</span>;
      case "pending":
        return <span className="badge badge-pending">Pending</span>;
      default:
        return <span className="badge badge-default">Unknown</span>;
    }
  };

  const handleSuspend = async (id) => {
    await axios.put(`http://localhost:3000/users/${id}/suspend`);
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, status: "suspended" } : u))
    );
  };

  const handleActivate = async (id) => {
    await axios.put(`http://localhost:3000/users/${id}/activate`);
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, status: "active" } : u))
    );
  };

  return (
    <div className="user-page">
      <div className="header">
        <h1>User Management</h1>
        <p>Manage user roles, status, and permissions</p>
      </div>

      {/* Filters */}
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
          <option value="general">General</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>

        <button className="filter-btn">
          <Filter size={16} /> More Filters
        </button>
      </div>

      {/* User Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
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
                    <div className="user-info">
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.name}
                        className="avatar"
                      />
                      <div>
                        <p className="user-name">
                          {user.name}{" "}
                          {user.verified && (
                            <CheckCircle size={14} className="verified-icon" />
                          )}
                        </p>
                        <p className="user-location">{user.location}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <p>
                      <Mail size={14} className="icon-inline" /> {user.email}
                    </p>
                    <p>
                      <Phone size={14} className="icon-inline" /> {user.phone}
                    </p>
                  </td>

                  <td>
                    <div className="role">
                      {user.role === "admin" ? (
                        <Crown className="role-icon admin" />
                      ) : user.role === "event_manager" ? (
                        <Shield className="role-icon manager" />
                      ) : (
                        <Users className="role-icon general" />
                      )}
                      <span className={`role-text ${user.role}`}>
                        {user.role.replace("_", " ")}
                      </span>
                    </div>
                  </td>

                  <td>{user.joinDate || "N/A"}</td>

                  <td>{getStatusBadge(user.status)}</td>

                  <td>
                    <div className="action-btns">
                      <button className="icon-btn">
                        <Eye size={16} />
                      </button>
                      <button className="icon-btn">
                        <Edit size={16} />
                      </button>

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

                      <button className="icon-btn">
                        <MoreHorizontal size={16} />
                      </button>
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
