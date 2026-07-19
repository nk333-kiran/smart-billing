import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/dashboard/Layout";
import { getUsers, updateUser, deleteUser } from "../services/userApi";
import { toast } from "react-hot-toast";
import Pagination from "../components/customers/Pagination";

const Users = () => {
  const [data, setData] = useState({ users: [], total: 0, page: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const navigate = useNavigate();

  const fetchData = async (page = data.page) => {
    try {
      const res = await getUsers({ search, role: roleFilter, page, limit: data.limit });
      setData({ ...res, page, limit: data.limit });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load users");
    }
  };

  useEffect(() => {
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  const handleRoleChange = async (user, newRole) => {
    try {
      const updated = await updateUser(user._id, { role: newRole });
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u._id === user._id ? updated : u)),
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  const toggleActive = async (user) => {
    try {
      const updated = await updateUser(user._id, { isActive: !user.isActive });
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u._id === user._id ? updated : u)),
      }));
    } catch (e) {
      toast.error(e.response?.data?.message || "Toggle failed");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return;
    try {
      await deleteUser(user._id);
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== user._id),
        total: prev.total - 1,
      }));
      toast.success("User deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  const changePage = (p) => {
    fetchData(p);
  };

  return (
    <Layout>
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 rounded flex-1 min-w-[150px]"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Role</th>
                <th className="border px-2 py-1">Active</th>
                <th className="border px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-1">{u.name}</td>
                  <td className="border px-2 py-1">{u.email}</td>
                  <td className="border px-2 py-1">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      className="border px-1 py-0.5 rounded"
                    >
                      <option value="admin">Admin</option>
                      <option value="cashier">Cashier</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => toggleActive(u)}
                      className={`px-2 py-0.5 rounded ${u.isActive ? "bg-green-600 text-white" : "bg-gray-400 text-white"}`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => navigate(`/users/edit/${u._id}`)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <Pagination
            page={data.page}
            total={data.total}
            limit={data.limit}
            onPageChange={changePage}
          />
    </Layout>
  );
};

export default Users;
