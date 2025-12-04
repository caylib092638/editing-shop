// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Admin.css";


function extractStoragePath(publicUrl) {
  if (!publicUrl) return null;
  try {
    // handle urls like:
    // https://<project>.supabase.co/storage/v1/object/public/customer-files/folder/filename.png
    const s = publicUrl.split("/customer-files/");
    if (s.length > 1) {
      // remove query string
      return s[1].split("?")[0];
    }
    // other possible form: /storage/v1/object/public/customer-files/...
    const alt = publicUrl.split("/object/public/customer-files/");
    if (alt.length > 1) return alt[1].split("?")[0];
    return null;
  } catch (err) {
    return null;
  }
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState(null); // order for modal
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("fetchOrders:", error);
    else setOrders(data || []);
    setLoading(false);
  }

  useEffect(() => {
   
    fetchOrders();
  }, []);

  async function updateStatus(id, newStatus) {
    setActionLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      await fetchOrders();
    }
    setActionLoading(false);
  }

  async function deleteOrder(order) {
    const ok = confirm(`Delete order from ${order.name}? This will remove the file and the DB row.`);
    if (!ok) return;
    setActionLoading(true);

    // 1) try remove storage file (if exists)
    try {
      const path = extractStoragePath(order.file_url);
      if (path) {
        const { error: rmErr } = await supabase.storage
          .from("customer-files")
          .remove([path]);
        if (rmErr) {
          // not fatal — show warning
          console.warn("Storage remove error:", rmErr);
        }
      }
    } catch (err) {
      console.warn("Error deleting file:", err);
    }

    // 2) delete DB row
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (error) {
      alert("Failed to delete order: " + error.message);
    } else {
      await fetchOrders();
    }

    setActionLoading(false);
  }

  // filtered orders
  const filtered = orders.filter(o => {
    if (!searchText) return true;
    const s = searchText.toLowerCase();
    return (
      (o.name || "").toLowerCase().includes(s) ||
      (o.email || "").toLowerCase().includes(s) ||
      (o.contact_number || "").toLowerCase().includes(s) ||
      (o.description || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
       <div className="orders-section">
  <h2>Customer Orders</h2>

  {orders.length === 0 ? (
    <p>No orders found.</p>
  ) : (
    orders.map((order) => (
      <div key={order.id} className="order-card">
        <h3>Order ID: {order.id}</h3>

        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Contact:</strong> {order.contact_number}</p>
        <p><strong>Description:</strong> {order.description}</p>
        <p><strong>Status:</strong> {order.status}</p>

        {order.file_url && (
          <div className="image-preview">
            <p><strong>Uploaded File:</strong></p>
            <img src={order.file_url} alt="uploaded" />
          </div>
        )}
      </div>
    ))
  )}
</div>


        <ul>
          <li className="active">Orders</li>
          <li>Settings</li>
          <li>Logs</li>
        </ul>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <h1>Orders Dashboard</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search name, email or contact..."
              style={{ padding: 8, borderRadius: 6, border: "1px solid #2c3138", background: "#0d1117", color: "#e6e6e6" }}
            />
            <button className="logout-btn" onClick={() => { if(confirm("Logout?")) location.href = "/"; }}>Logout</button>
          </div>
        </header>

        <div className="content-box">
          <h2 className="section-title">Orders List</h2>

          {loading ? (
            <p className="loading">Loading orders...</p>
          ) : (
            <>
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Preview</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(order => (
                    <tr key={order.id}>
                      <td style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}>{order.id}</td>
                      <td>{order.name}</td>
                      <td>{order.email}</td>
                      <td>{order.contact_number}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          disabled={actionLoading}
                          style={{ background: "#121418", color: "#e6e6e6", padding: 6, borderRadius: 6, border: "1px solid #2c3138" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>

                      <td>
                        {order.file_url ? (
                          <button className="view-btn" onClick={() => setSelected(order)}>Preview</button>
                        ) : "—"}
                      </td>

                      <td>
                        <button className="view-btn" onClick={() => setSelected(order)}>View</button>
                        <button
                          style={{ marginLeft: 8, background: "#b91c1c" }}
                          onClick={() => deleteOrder(order)}
                          disabled={actionLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 20 }}>No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {/* Modal for preview / details */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Order Details</h3>
              <button className="logout-btn" onClick={() => setSelected(null)}>Close</button>
            </div>

            <div style={{ marginTop: 12 }}>
              <p><b>Name:</b> {selected.name}</p>
              <p><b>Contact:</b> {selected.contact_number}</p>
              <p><b>Email:</b> {selected.email}</p>
              <p><b>Description:</b> {selected.description}</p>
              <p><b>Status:</b> {selected.status}</p>
              <p><b>Created:</b> {new Date(selected.created_at).toLocaleString()}</p>

              <div style={{ marginTop: 12 }}>
                {selected.file_url && (() => {
                  const url = selected.file_url;
                  // image?
                  if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?|$)/i)) {
                    return <img src={url} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />;
                  }
                  // video?
                  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) {
                    return <video controls src={url} style={{ width: "100%", borderRadius: 8 }} />;
                  }
                  // pdf or others
                  return <a href={url} target="_blank" rel="noreferrer">Open file</a>;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
