import React from "react";

function Loader() {
  return (
    <div className="loader-backdrop" aria-live="polite" aria-busy="true">
      <div className="text-center text-white">
        <div className="spinner-border text-light" role="status" />
        <div className="mt-3 fw-semibold">Loading quiz workspace</div>
      </div>
    </div>
  );
}

export default Loader;
