// ScanIDModal.jsx
import React, { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";

const ScanIDModal = ({ onScan }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Funksioni për të mbyllur modalin
  const closeModal = () => {
    dispatch(uiActions.closeScanIDModal());
  };

  // Opsioni për upload file
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Opsioni për kamerë
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, 300, 200);
    canvasRef.current.toBlob((blob) => {
      setImage(blob);
    }, "image/jpeg");
  };

  // Funksioni për të dërguar foton në backend dhe për të marrë të dhënat
  const handleScanClick = async () => {
    if (!image) {
      alert("Ngarkoni ose kapni një foto të ID-së!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://localhost:5000/api/scan-id", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error scanning ID");

      const data = await res.json();
      onScan(data); // data = { name, surname, dob, personalID }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ka ndodhur një gabim gjatë skanimit të ID-së.");
    }
  };

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Skanoni ID</h4>
          <button className="modal__close" onClick={closeModal}>
            <AiOutlineClose />
          </button>
        </header>

        <p>Mund të përdorni kamerën ose të ngarkoni një foto të ID-së.</p>

        {/* Upload file */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Kamera */}
        <div style={{ marginTop: "10px" }}>
          <button className="btn secondary" onClick={startCamera}>Start Camera</button>
          <video ref={videoRef} width="300" height="200" style={{ display: "block", marginTop: "5px" }} />
          <button className="btn secondary" onClick={capturePhoto} style={{ marginTop: "5px" }}>Capture Photo</button>
          <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
        </div>

        <hr style={{ margin: "15px 0" }} />

        <button className="btn primary" onClick={handleScanClick}>
          Plotëso automatikisht
        </button>
        <button className="btn secondary" onClick={closeModal} style={{ marginLeft: "10px" }}>
          Mbyll
        </button>
      </div>
    </section>
  );
};

export default ScanIDModal;
