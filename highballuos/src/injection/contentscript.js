var injectionScript = document.createElement('script');

injectionScript.src = chrome.runtime.getURL('injection-scripts/focus.js');
injectionScript.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(injectionScript);