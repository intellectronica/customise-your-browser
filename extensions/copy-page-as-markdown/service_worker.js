const COMMAND_NAME = 'copy-page-as-markdown';

function triggerCopy(tabId) {
  if (!tabId) {
    return;
  }

  chrome.tabs.sendMessage(tabId, { type: COMMAND_NAME }, () => {
    if (chrome.runtime.lastError) {
      console.warn('[Copy as Markdown] Unable to send message:', chrome.runtime.lastError.message);
    }
  });
}

chrome.action.onClicked.addListener((tab) => {
  triggerCopy(tab.id);
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== COMMAND_NAME) {
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const [activeTab] = tabs;
    triggerCopy(activeTab ? activeTab.id : undefined);
  });
});
