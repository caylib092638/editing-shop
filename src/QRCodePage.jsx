import { useEffect, useState } from "react";
import QRCode from "qrcode";

function QRCodePage() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const websiteUrl = "http://localhost:5173/"; 
    QRCode.toDataURL(websiteUrl).then(setQrUrl);
  }, []);

  return (
    <div className="container">
      <h1>Scan to Visit Editing Shop</h1>
      {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: 250 }} />}
      <p>Customers can scan this QR code to open the website.</p>
    </div>
  );
}

export default QRCodePage;
