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
    <div className="container">
      <h1>Editing Shop - Submit Your Request</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={name}
          onChange={(e) => setName(e.target.value)} required />

        <input placeholder="Contact Number" value={contact}
          onChange={(e) => setContact(e.target.value)} required />

        <input placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />

        <textarea placeholder="Describe the edit you want"
          value={description}
          onChange={(e) => setDescription(e.target.value)} required />

        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />

        <button disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
