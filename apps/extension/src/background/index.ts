chrome.runtime.onInstalled.addListener(() => {
  console.info("[background] Shoot installed and ready");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING") {
    sendResponse({ type: "PONG", sender: "background" });
    return;
  }

  if (message?.type === "OPEN_POPUP") {
    chrome.action.openPopup().catch((error) => {
      console.error("[background] Failed to open popup", error);
    });
    sendResponse({ status: "ok" });
    return;
  }

  return false;
});
