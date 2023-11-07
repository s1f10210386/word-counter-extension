function sendSelectedTextLength() {
  const selectedText = window.getSelection()?.toString();
  if (selectedText) {
    const message = {
      type: 'textSelected',
      textLength: selectedText.length,
    };
    chrome.runtime.sendMessage(message);
  }
}

document.addEventListener('mouseup', sendSelectedTextLength);
document.addEventListener('keyup', sendSelectedTextLength);
