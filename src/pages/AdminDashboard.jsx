import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "./admin.css";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul>
          <li className="active">Orders</li>
          <li>Settings</li>
          <li>Logs</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">

        {/* Top Header */}
        <header className="top-header">
          <h1>Orders Dashboard</h1>
          <button className="logout-btn">Logout</button>
        </header>

        {/* Table Section */}
        <div className="content-box">
          <h2 className="section-title">Orders List</h2>

          {loading ? (
            <p className="loading">Loading orders...</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.name}</td>
                    <td>{order.email}</td>
                    <td>{order.contact_number}</td>
                    <td>{order.status}</td>
                    <td>
                      <button className="view-btn">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
