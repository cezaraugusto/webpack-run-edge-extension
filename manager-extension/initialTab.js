/* global browser */
// Ideas here are adapted from
// https://github.com/jeremyben/webpack-browser-extension-launcher
// Released under MIT license.

// Create a new tab and set it to background.
// We want the user-selected page to be active,
// not browser://extensions.
function createEdgeExtensionsTab (initialTab) {
  // Create an inactive tab
  chrome.tabs.create(
    { url: 'edge://extensions/', active: false },
    function setBackgroundTab (extensionsTab) {
      // Get current browser://extensions tab and move it left.
      // This action auto-activates the tab
      chrome.tabs.move(extensionsTab.id, { index: 0 }, () => {
        // Get user-selected initial page tab activate the right tab
        chrome.tabs.update(initialTab.id, { active: true })
      })
    }
  )
}

chrome.tabs.query({ active: true }, ([initialTab]) => {
  if (initialTab.url === 'about:blank') {
    chrome.tabs.update({ url: 'edge://extensions/' })

    return
  }

  createEdgeExtensionsTab(initialTab)
})
