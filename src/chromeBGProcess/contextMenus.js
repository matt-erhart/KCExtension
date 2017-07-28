let windowId = 0;
const CONTEXT_MENU_ID = "example_context_menu";
let text = "";

function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId, () => {
      const err = chrome.runtime.lastError;
      if (err) {
        console.warn("Window delete error ignored:", err);
      }
    });
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

export function popWindow(type, selectedText) {
  text = selectedText;
  closeIfExist();

  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    console.log("launch tab", tabs[0]);
    const options = {
      type: "popup",
      left: 0,
      top: 0,
      width: tabs[0].width || 1200,
      height: tabs[0].height || 800
    };
    if (type === "open") {
      options.url = "popup.html";
      localStorage.selectedText = selectedText;
      localStorage.parentWindowId = tabs[0].windowId;
      chrome.windows.create(options, win => {
        windowId = win.id;
        chrome.windows.update(windowId, { state: "maximized" });
        console.log("made window");
        chrome.runtime.onMessage.addListener(
          (request, sender, sendResponse) => {
            console.log("request", request);
            switch (request.type) {
              case "dragSelect":
                sendResponse("got it");
              case "getText":
                sendResponse(selectedText);
            }
          }
        );
      });
    }
  });
}

chrome.contextMenus.create(
  {
    id: "selected text",
    title: "Create snippet: %s",
    contexts: ["selection", "page"],
    documentUrlPatterns: ["https://*/*", "http://*/*", "<all_urls>", "*://*/*.pdf"],
    onclick: function(info, tab) {
      popWindow("open", info.selectionText || '');
    }
  },
  () => {
    const err = chrome.runtime.lastError;
    if (err) {
      console.warn("Context menu error ignored:", err);
    }
  }
);

chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.executeScript(
    {
      code: "window.getSelection().toString();"
    },
    function(selection) {
      chrome.tabs.executeScript({
        file: "../injectedWebsiteContent/inject.js"
      });
      // popWindow('open', selection[0]);
    }
  );
});
