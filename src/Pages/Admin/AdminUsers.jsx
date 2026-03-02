import { useEffect, useState } from "react";
import api from "../../services/Api";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        params: {
          search: search || undefined,
          role: role || undefined,
        },
      });
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users.");
    }
  };

  const toggleUser = async (id) => {
    try {
      const res = await api.put(`/admin/users/${id}/toggle`);
      toast.success(res.data);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Users Management
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Search, filter, and manage platform users.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md p-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input-field md:w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="input-field md:w-56"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="VENDOR">VENDOR</option>
          <option value="CUSTOMER">CUSTOMER</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="text-5xl">👤</div>
            <p className="text-gray-500 dark:text-gray-400">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Role</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user) => {
                  const roleColor =
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : user.role === "VENDOR"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4 font-medium">#{user.id}</td>

                      <td className="px-6 py-4">{user.name}</td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${roleColor}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleUser(user.id)}
                          className={`px-4 py-2 rounded-xl cursor-pointer text-white text-xs font-medium shadow-md transition-all duration-200 hover:scale-[1.03]
                          ${
                            user.enabled
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {user.enabled ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
