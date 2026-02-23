// ScanIDModal.jsx
import React, { useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import Tesseract from "tesseract.js";

/**
 * Parse OCR text to extract name, surname, dateOfBirth, personalId.
 * Uses simple regex patterns - suitable for academic project.
 */
function parseOCRText(text) {
  const result = { name: "", surname: "", dob: "", personalID: "" };
  if (!text || typeof text !== "string") return result;

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Date patterns: DD/MM/YYYY, DD.MM.YYYY, DD-MM-YYYY, YYYY-MM-DD
  const datePatterns = [
    /\b(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})\b/,
    /\b(\d{4}[./-]\d{1,2}[./-]\d{1,2})\b/,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const raw = match[1].replace(/\./g, "-").replace(/\//g, "-");
      const parts = raw.split("-");
      if (parts[0].length === 4) {
        result.dob = raw;
      } else if (parts.length === 3) {
        const [d, m, y] = parts;
        const year = y.length === 2 ? `20${y}` : y;
        result.dob = `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      } else {
        result.dob = raw;
      }
      break;
    }
  }

  // Personal ID: usually digits, optionally with letters (e.g. A12345678B)
  const idPattern = /\b([A-Z]?\d{6,}[A-Z]?)\b/i;
  const idMatch = text.match(idPattern);
  if (idMatch) {
    result.personalID = idMatch[1];
  }

  // Names: assume first two non-empty, non-numeric lines are name and surname
  const nameCandidates = lines.filter(
    (l) =>
      l.length > 1 &&
      !/^\d+$/.test(l) &&
      !datePatterns[0].test(l) &&
      !datePatterns[1].test(l) &&
      !idPattern.test(l)
  );
  if (nameCandidates.length >= 1) {
    result.name = nameCandidates[0];
  }
  if (nameCandidates.length >= 2) {
    result.surname = nameCandidates[1];
  }

  return result;
}

const ScanIDModal = ({ onScan }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progressText, setProgressText] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const closeModal = () => {
    dispatch(uiActions.closeScanIDModal());
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

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

  const handleScanClick = async () => {
    if (!image) {
      alert("Ngarkoni ose kapni një foto të ID-së!");
      return;
    }

    setIsScanning(true);
    setProgressText("Duke ngarkuar...");

    try {
      const imageSource =
        image instanceof Blob ? URL.createObjectURL(image) : image;

      const { data } = await Tesseract.recognize(imageSource, "eng+sqi", {
        logger: (m) => {
          if (m.status === "loading tesseract core") {
            setProgressText("Duke ngarkuar Tesseract...");
          } else if (m.status === "initializing tesseract") {
            setProgressText("Duke inicializuar...");
          } else if (m.status === "recognizing text") {
            setProgressText(`Duke skanuar... ${Math.round((m.progress || 0) * 100)}%`);
          }
        },
      });

      if (image instanceof Blob) {
        URL.revokeObjectURL(imageSource);
      }

      setProgressText("Duke analizuar teksti...");

      const parsed = parseOCRText(data.text);
      onScan(parsed);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Ka ndodhur një gabim gjatë skanimit të ID-së.");
    } finally {
      setIsScanning(false);
      setProgressText("");
    }
  };

  const isDisabled = isScanning;

  return (
    <section className="modal">
      <div className="modal__content">
        <header className="modal__header">
          <h4>Skanoni ID</h4>
          <button
            className="modal__close"
            onClick={closeModal}
            disabled={isDisabled}
          >
            <AiOutlineClose />
          </button>
        </header>

        <p>Mund të përdorni kamerën ose të ngarkoni një foto të ID-së.</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isDisabled}
        />

        <div style={{ marginTop: "10px" }}>
          <button
            className="btn secondary"
            onClick={startCamera}
            disabled={isDisabled}
          >
            Start Camera
          </button>
          <video
            ref={videoRef}
            width="300"
            height="200"
            style={{ display: "block", marginTop: "5px" }}
          />
          <button
            className="btn secondary"
            onClick={capturePhoto}
            style={{ marginTop: "5px" }}
            disabled={isDisabled}
          >
            Capture Photo
          </button>
          <canvas
            ref={canvasRef}
            width="300"
            height="200"
            style={{ display: "none" }}
          />
        </div>

        {isScanning && progressText && (
          <p style={{ marginTop: "10px", fontWeight: 500 }}>{progressText}</p>
        )}

        <hr style={{ margin: "15px 0" }} />

        <button
          className="btn primary"
          onClick={handleScanClick}
          disabled={isDisabled}
        >
          {isScanning ? "Duke skanuar..." : "Plotëso automatikisht"}
        </button>
        <button
          className="btn secondary"
          onClick={closeModal}
          style={{ marginLeft: "10px" }}
          disabled={isDisabled}
        >
          Mbyll
        </button>
      </div>
    </section>
  );
};

export default ScanIDModal;
