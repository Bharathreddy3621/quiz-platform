import React from "react";

function PageTitle({ title, subtitle }) {
  return (
    <div className="section-heading mb-4">
      <div>
        <div className="hero-kicker mb-1">QUIZ APP</div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageTitle;
