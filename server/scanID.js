const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const cors = require("cors");

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/scan-id", upload.single("image"), async (req, res) => {
  try {
    const { buffer } = req.file;
    const { data: { text } } = await Tesseract.recognize(buffer, "eng");

    const nameMatch = text.match(/Em[eë]r:\s*(.+)/i);
    const surnameMatch = text.match(/Mbiem[eë]r:\s*(.+)/i);
    const dobMatch = text.match(/Dat[eë]lindja:\s*(.+)/i);
    const idMatch = text.match(/ID:\s*(.+)/i);

    res.json({
      name: nameMatch ? nameMatch[1].trim() : "",
      surname: surnameMatch ? surnameMatch[1].trim() : "",
      dob: dobMatch ? dobMatch[1].trim() : "",
      personalID: idMatch ? idMatch[1].trim() : ""
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gabim gjatë skanimit të ID-së" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
