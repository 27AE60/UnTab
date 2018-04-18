'use strict';

module.exports = {
  runtime: {
    onMessage: {
      addListener(fn) {
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
          return fn(message, sender)
        })
      }
    },
    onMessageExternal: { // not supported on firefox
      addListener(fn) {
        browser.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
          return fn(message, sender)
        })
      }
    },
    onInstalled: {
      addListener(fn) {
        browser.runtime.onInstalled.addListener(fn)
      }
    },
    sendMessage() {
      return browser.runtime.sendMessage.apply(null, arguments)
    },
    getManifest() {
      return browser.runtime.getManifest()
    },
    setUninstallURL() {
      return browser.runtime.setUninstallURL.apply(null, arguments)
    }
  },
  tabs: {
    get() {
      return browser.tabs.get.apply(null, arguments)
    },
    query() {
      return browser.tabs.query.apply(null, arguments)
    },
    create() {
      browser.tabs.create.apply(null, arguments)
    },
    insertCSS() {
      return browser.tabs.insertCSS.apply(null, arguments)
    },
    executeScript() {
      return browser.tabs.executeScript.apply(null, arguments)
    },
    sendMessage() {
      return browser.tabs.sendMessage.apply(null, arguments)
    },
    captureVisibleTab() {
      return browser.tabs.captureVisibleTab.apply(null, arguments)
    },
    onActivated: {
      addListener(fn) {
        chrome.tabs.onActivated.addListener(fn)
      }
    }
  },
  extension: {
    getURL() {
      return browser.extension.getURL.apply(null, arguments)
    }
  },
  commands: {
    onCommand: {
      addListener(fn) {
        browser.commands.onCommand.addListener(fn)
      }
    }
  },
  contextMenus: {
    create() {
      return browser.contextMenus.create.apply(null, arguments)
    },
    onClicked: {
      addListener(fn) {
        browser.contextMenus.onClicked.addListener(fn)
      }
    }
  },
  identity: {
    getRedirectURL() {
      // return browser.identity.getRedirectURL.apply(null, arguments)
      return 'http://chapiapp.com'
    },
    launchWebAuthFlow() {
      return browser.identity.launchWebAuthFlow.apply(null, arguments)
    }
  },
  browserAction: {
    setBadgeText() {
      browser.browserAction.setBadgeText.apply(null, arguments)
    },
    getBadgeText() {
      return browser.browserAction.getBadgeText.apply(null, arguments)
    },
    setBadgeBackgroundColor() {
      browser.browserAction.setBadgeBackgroundColor.apply(null, arguments)
    },
    onClicked: {
      addListener(fn) {
        chrome.browserAction.onClicked.addListener(fn)
      }
    }
  },
  alarms: {
    create() {
      browser.alarms.create.apply(null, arguments)
    },
    onAlarm: {
      addListener(fn) {
        browser.alarms.onAlarm.addListener(fn)
      }
    }
  }
}
