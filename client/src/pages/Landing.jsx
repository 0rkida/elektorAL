import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg"; // kontrollo path-in
import bg from "../assets/background.png"; // kontrollo path-in

const LandingPage = () => {
  return (
    <section className="landing">
      <div className="landing__left">
        <div className="landing__logo">
          <img src={logo} alt="elektorAL" />
        </div>
        <h1>ZËRI YT, FUQIA JOTE!</h1>
        <p>Një mënyrë e thjeshtë, e sigurt dhe transparente për të votuar online.</p>
        <div className="landing__buttons">
          <Link to="/register" className="btn btn--primary">
            Regjistrohu
          </Link>
          <Link to="/login" className="btn btn--secondary">
            Hyr
          </Link>
        </div>

        <div className="landing__info">
          <h2>Pse të zgjedhësh Voting App?</h2>
          <ul className="landing__features">
            <li>🔒 Siguri e plotë</li>
            <li>⚡ Përdorim i thjeshtë</li>
            <li>📊 Transparencë dhe besueshmëri</li>
          </ul>
        </div>

        <div className="landing__about">
          <h2>Kush jemi ne?</h2>
          <p>
            Ne besojmë se demokracia duhet të jetë e qasshme për të gjithë.
            Aplikacioni ynë modernizon procesin e votimit duke e bërë më të shpejtë,
            më të sigurt dhe më të drejtë për çdo qytetar.
          </p>
        </div>

        <footer className="landing__footer">
          <p>© 2025 elektorAL. Të gjitha të drejtat e rezervuara.</p>
        </footer>
      </div>

      <div className="landing__right">
        <img src={bg} alt="voting background" />
      </div>
    </section>
  );
};

export default LandingPage;
