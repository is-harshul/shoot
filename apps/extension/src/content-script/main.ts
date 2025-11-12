import "./styles.css";

const FAB_ID = "shoot-fab";

const ensureFab = () => {
  if (document.getElementById(FAB_ID)) return;

  const button = document.createElement("button");
  button.id = FAB_ID;
  button.type = "button";
  button.title = "Open Shoot";
  button.innerText = "Shoot";
  button.className = "shoot-fab";
  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "OPEN_POPUP" }).catch((error) => {
      console.error("[content-script] Failed to open popup", error);
    });
  });

  document.body.appendChild(button);
};

const observer = new MutationObserver(() => ensureFab());

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ensureFab, { once: true });
} else {
  ensureFab();
}

observer.observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener("beforeunload", () => observer.disconnect());
