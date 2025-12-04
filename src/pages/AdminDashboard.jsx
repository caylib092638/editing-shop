import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
    } else {
      setOrders(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Orders List</h2>

          {/* Loading State */}
          {loading && <p>Loading orders...</p>}

          {/* Orders Table */}
          {!loading && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Contact</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="p-2 border">{order.id}</td>
                    <td className="p-2 border">{order.name}</td>
                    <td className="p-2 border">{order.email}</td>
                    <td className="p-2 border">{order.contact_number}</td>
                    <td className="p-2 border capitalize">{order.status}</td>
                    <td className="p-2 border">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </main>
    </div>
  );
}
