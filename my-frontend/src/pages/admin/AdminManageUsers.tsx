import React, { useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  wallet_address: string;
  role: "STUDENT" | "VENDOR";
  status: "ACTIVE" | "INACTIVE";
}

const AdminManageUsers: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const studentRes = await api.get("/admin/students");
      const vendorRes = await api.get("/admin/vendors");

      const studentData = studentRes.data.students.map((s: any) => ({
        ...s,
        role: "STUDENT",
      }));

      const vendorData = vendorRes.data.vendors.map((v: any) => ({
        ...v,
        role: "VENDOR",
      }));

      setStudents(studentData);
      setVendors(vendorData);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (user: User) => {
    try {
      const newStatus =
        user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      if (user.role === "STUDENT") {
        await api.post("/admin/update-student-status", {
          walletAddress: user.wallet_address,
          status: newStatus,
        });
      } else {
        await api.post("/admin/update-vendor-status", {
          walletAddress: user.wallet_address,
          status: newStatus,
        });
      }

      fetchUsers();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredStudents = students.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVendors = vendors.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-lg font-semibold">
        Loading users...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold text-center">
        Admin User Control Panel
      </h1>

      {/* ================= SEARCH BAR ================= */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ====== 2 COLUMN GRID ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ================= STUDENTS BOX ================= */}
        <div className="bg-card rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Student Management ({filteredStudents.length})
          </h2>

          {filteredStudents.length === 0 && (
            <p className="text-center text-muted-foreground">
              No students found
            </p>
          )}

          {filteredStudents.map((user) => (
            <div
              key={`student-${user.id}`}
              className="flex justify-between items-center border-b pb-4 mb-4"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                </p>

                <p
                  className={`text-sm font-medium ${
                    user.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {user.status}
                </p>
              </div>

              <button
                onClick={() => toggleStatus(user)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  user.status === "ACTIVE"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {user.status === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          ))}
        </div>

        {/* ================= VENDORS BOX ================= */}
        <div className="bg-card rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-600">
            Vendor Management ({filteredVendors.length})
          </h2>

          {filteredVendors.length === 0 && (
            <p className="text-center text-muted-foreground">
              No vendors found
            </p>
          )}

          {filteredVendors.map((user) => (
            <div
              key={`vendor-${user.id}`}
              className="flex justify-between items-center border-b pb-4 mb-4"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {user.email}
                </p>

                <p
                  className={`text-sm font-medium ${
                    user.status === "ACTIVE"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {user.status}
                </p>
              </div>

              <button
                onClick={() => toggleStatus(user)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  user.status === "ACTIVE"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {user.status === "ACTIVE"
                  ? "Deactivate"
                  : "Activate"}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminManageUsers;