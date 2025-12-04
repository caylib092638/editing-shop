import { useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";


function App() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Upload file to storage
    const fileName = Date.now() + "-" + file.name;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("customer-files")
      .upload(fileName, file);

    if (uploadError) {
      setMessage("File upload failed.");
      setLoading(false);
      return;
    }

    const file_url = supabase.storage
      .from("customer-files")
      .getPublicUrl(fileName).data.publicUrl;

    // 2. Insert order into database
    const { error: dbError } = await supabase.from("orders").insert([
      {
        name: name,
        contact_number: contact,
        email: email,
        description: description,
        file_url: file_url,
      },
    ]);

    if (dbError) {
      setMessage("Database error occurred.");
      setLoading(false);
      return;
    }

    // Success!
    setMessage("Order submitted successfully!");
    setName("");
    setContact("");
    setEmail("");
    setDescription("");
    setFile(null);
    setLoading(false);
  }
  return (
  <div className="wrapper">
    <div className="form-card">

      <h1 className="title">Pule's Shop - Submit Request</h1>

      <form onSubmit={handleSubmit} className="form">

        <input
          className="input"
          placeholder="Pangalan po"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Contact Number or TG"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />

        <input
          className="input"
          placeholder="Email or FB Account"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          className="textarea"
          placeholder="Describe the edit you want"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button
          disabled={loading}
          className="button"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

      </form>

      {message && (
        <p className="message">{message}</p>
      )}
    </div>
  </div>
);
}

export default App;
