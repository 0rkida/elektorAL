import React from "react";
import { Link } from "react-router-dom";


const LandingPage = () => {
  return (
    <section className="landing">
      <div className="landing__hero">
        <div className="landing__logo">
          <img src="client/src/assets/logo.jpg" alt="elektorAL" />
        </div>
        <h1>Zëri yt, fuqia jote!</h1>
        <p>Një mënyrë e thjeshtë, e sigurt dhe transparente për të votuar online.</p>
        <div className="landing__buttons">
          <Link to="/register" className="btn btn--primary">
            Regjistrohu
          </Link>
          <Link to="/login" className="btn btn--secondary">
            Hyr
          </Link>
        </div>
      </div>

      <div className="landing__info">
        <h2>Pse të zgjedhësh Voting App?</h2>
        <div className="landing__features">
          <div className="feature">
            <span>🔒</span>
            <p>Siguri e plotë</p>
          </div>
          <div className="feature">
            <span>⚡</span>
            <p>Përdorim i thjeshtë</p>
          </div>
          <div className="feature">
            <span>📊</span>
            <p>Transparencë dhe besueshmëri</p>
          </div>
        </div>
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
    </section>
  );
};

export default LandingPage;
