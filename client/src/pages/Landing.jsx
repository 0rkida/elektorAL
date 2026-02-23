import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // kontrollo path-in


const LandingPage = () => {
  return (
    <section className="landing">
      <div className="landing__left">
        <div className="landing__hero">
         
          <h1 className="landing__title">Zëri yt, fuqia jote</h1>
          <p className="landing__tagline">
            Një mënyrë e thjeshtë, e sigurt dhe transparente për të votuar online.
          </p>
          <div className="landing__buttons">
            <Link to="/register" className="btn btn--primary">
              Regjistrohu
            </Link>
            <Link to="/login" className="btn btn--secondary">
              Hyr
            </Link>
          </div>
        </div>

        <div className="landing__divider" aria-hidden="true" />

        <div className="landing__card landing__info">
          <h2 className="landing__card-title">Pse elektorAL?</h2>
          <ul className="landing__features">
            <li><span className="landing__feature-icon">🔒</span> Siguri e plotë</li>
            <li><span className="landing__feature-icon">⚡</span> Përdorim i thjeshtë</li>
            <li><span className="landing__feature-icon">📊</span> Transparencë dhe besueshmëri</li>
          </ul>
        </div>

        <footer className="landing__footer">
          <p>© 2025 elektorAL. Të gjitha të drejtat e rezervuara.</p>
        </footer>
      </div>

      <div className="landing__right">
        <div className="landing__image-wrapper">
        
            <img src={logo} alt="elektorAL" />
          
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
