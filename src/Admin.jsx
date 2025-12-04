import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Admin() {
  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id, newStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) fetchOrders();
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Description</th>
            <th>File</th>
            <th>Status</th>
            <th>Change Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.name}</td>
              <td>{order.contact_number}</td>
              <td>{order.email}</td>
              <td>{order.description}</td>
              <td>
                <a href={order.file_url} target="_blank">View File</a>
              </td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Admin;
