import browser from 'browser';

browser.browserAction.onClicked.addListener((e) => {
  browser.tabs.create({
    url: 'about:newtab'
  }).catch(err => {
    console.log(err)
  })
})
