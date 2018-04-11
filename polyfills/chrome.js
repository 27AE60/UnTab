'use strict';

function interceptor(fn, args) {
  return new Promise((resolve, reject) => {
    args = Array.prototype.slice.call(args)
      .concat([function() {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (arguments.length === 1) {
          resolve(arguments[0]);
        } else {
          resolve(arguments);
        }
      }]);
    fn.apply(this, args)
  })
}

module.exports = {
  runtime: {
    onMessage: {
      addListener(fn) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          fn(message, sender).then(function(val) {
            sendResponse(val)
          }, function(val) {
            sendResponse(val)
          })
          return true
        })
      }
    },
    onMessageExternal: {
      addListener(fn) {
        chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
          fn(message, sender).then(function(val) {
            sendResponse(val)
          }, function(val) {
            sendResponse(val)
          })
          return true
        })
      }
    },
    onInstalled: {
      addListener(fn) {
        chrome.runtime.onInstalled.addListener(fn)
      }
    },
    sendMessage() {
      return interceptor(chrome.runtime.sendMessage, arguments)
    },
    getManifest() {
      return chrome.runtime.getManifest()
    },
    setUninstallURL() {
      return interceptor(chrome.runtime.setUninstallURL, arguments)
    }
  },
  tabs: {
    get() {
      return interceptor(chrome.tabs.get, arguments)
    },
    query() {
      return interceptor(chrome.tabs.query, arguments)
    },
    create() {
      return interceptor(chrome.tabs.create, arguments)
    },
    getCurrent() {
      return interceptor(chrome.tabs.getCurrent, arguments)
    },
    insertCSS() {
      return interceptor(chrome.tabs.insertCSS, arguments)
    },
    executeScript() {
      return interceptor(chrome.tabs.executeScript, arguments)
    },
    sendMessage() {
      return interceptor(chrome.tabs.sendMessage, arguments)
    },
    captureVisibleTab() {
      return interceptor(chrome.tabs.captureVisibleTab, arguments)
    },
    onActivated: {
      addListener(fn) {
        chrome.tabs.onActivated.addListener(fn)
      }
    }
  },
  extension: {
    getURL() {
      return chrome.extension.getURL.apply(null, arguments)
    }
  },
  commands: {
    onCommand: {
      addListener(fn) {
        chrome.commands.onCommand.addListener(fn)
      }
    }
  },
  contextMenus: {
    create() {
      return chrome.contextMenus.create.apply(null, arguments)
    },
    onClicked: {
      addListener(fn) {
        chrome.contextMenus.onClicked.addListener(fn)
      }
    }
  },
  identity: {
    getRedirectURL() {
      return chrome.identity.getRedirectURL.apply(null, arguments)
    },
    launchWebAuthFlow() {
      return interceptor(chrome.identity.launchWebAuthFlow, arguments)
    }
  },
  browserAction: {
    setBadgeText() {
      chrome.browserAction.setBadgeText.apply(null, arguments)
    },
    getBadgeText() {
      return interceptor(chrome.browserAction.getBadgeText, arguments)
    },
    setBadgeBackgroundColor() {
      chrome.browserAction.setBadgeBackgroundColor.apply(null, arguments)
    },
    onClicked: {
      addListener(fn) {
        chrome.browserAction.onClicked.addListener(fn)
      }
    }
  },
  storage: {
    local: {
      get() {
        return interceptor(chrome.storage.local.get, arguments)
      },
      set() {
        return interceptor(chrome.storage.local.set, arguments)
      },
      clear() {
        return interceptor(chrome.storage.local.clear, arguments)
      }
    },
    sync: {
      get() {
        return interceptor(chrome.storage.sync.get, arguments)
      },
      set() {
        return interceptor(chrome.storage.sync.set, arguments)
      },
      clear() {
        return interceptor(chrome.storage.sync.clear, arguments)
      }
    }
  },
  webRequest: {
    onBeforeRequest: {
      addListener(fn, filter, extraInfoSpec) {
        chrome.webRequest.onBeforeRequest.addListener(fn, filter, extraInfoSpec)
      }
    },
    handlerBehaviorChanged(fn) {
      chrome.webRequest.handlerBehaviorChanged(fn)
    }
  }
}
