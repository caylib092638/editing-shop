import { useState, useEffect } from "react";
import supabase from "./supabaseClient";

export default function Admin() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading orders:", error);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Admin Panel – Submitted Orders</h1>

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse", background: "white" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Description</th>
            <th>File</th>
            <th>Status</th>
            <th>Created</th>
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
                {order.file_url ? (
                  <a href={order.file_url} target="_blank" rel="noreferrer">
                    View File
                  </a>
                ) : (
                  "—"
                )}
              </td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
