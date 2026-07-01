let toastContainer;

function getToastContainer() {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  toastContainer = document.getElementById("quiz-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "quiz-toast-container";
    toastContainer.className = "position-fixed top-0 end-0 p-3";
    toastContainer.style.zIndex = "3000";
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

function showToast(type, title, description) {
  if (typeof document === "undefined") {
    return;
  }

  const container = getToastContainer();
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} alert-dismissible fade show shadow-sm mb-2`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
    <div class="fw-semibold">${title}</div>
    <div>${description}</div>
  `;

  container.appendChild(toast);

  window.setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();

    if (container.childElementCount === 0) {
      container.remove();
      toastContainer = null;
    }
  }, 3000);
}

export function showSuccess(message) {
  showToast("success", "Success", message);
}

export function showError(message) {
  showToast("danger", "Error", message);
}
