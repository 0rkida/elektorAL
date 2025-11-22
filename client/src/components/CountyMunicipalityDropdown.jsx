import { useEffect, useState } from "react";
import axios from "axios";

const CountyMunicipalityDropdown = ({ active }) => {
  const [counties, setCounties] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");

  // Fetch counties
  useEffect(() => {
    axios.get("/api/counties")
      .then(res => setCounties(res.data))
      .catch(err => console.log(err));
  }, []);

  // Fetch municipalities only when a county is selected
  useEffect(() => {
    if (!selectedCounty) {
      setMunicipalities([]);
      setSelectedMunicipality("");
      return;
    }
    axios.get(`/api/municipalities/${selectedCounty}`)
      .then(res => setMunicipalities(res.data))
      .catch(err => console.log(err));
  }, [selectedCounty]);

  if (!active) {
    return (
      <div className="location-text">
        <span><strong>Qarku:</strong> {selectedCounty ? selectedCounty : "—"} </span>
        <span> | </span>
        <span><strong>Bashkia:</strong> {selectedMunicipality ? selectedMunicipality : "—"}</span>
      </div>
    );
  }

  return (
    <div className="filters">
      <select
        value={selectedCounty}
        onChange={(e) => setSelectedCounty(e.target.value)}
      >
        <option value="">Zgjidh Qarkun</option>
        {counties.map(c => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </select>

      <select
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
        disabled={!selectedCounty}
      >
        <option value="">Zgjidh Bashkinë</option>
        {municipalities.map(m => (
          <option key={m._id} value={m._id}>{m.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CountyMunicipalityDropdown;
