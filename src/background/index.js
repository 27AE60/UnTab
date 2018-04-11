import browser from 'browser';

const BingeProviders = [
  'primevideo.com',
  'netflix.com',
  '9gag.com',
  'imgur.com',
  'facebook.com'
];

browser.tabs.query({
  active: true
}).then(tabs => {
  tabs.forEach(tab => {
    console.log(tab);
  })
}).catch(err => {
  console.log(err)
})

browser.storage.sync.get(['providers']).then(result => {
  if (result.providers && result.providers instanceof Array) {
    return Promise.resolve(
      result.providers.concat(BingeProviders).filter((ele, idx, self) => {
        return self.indexOf(ele) === idx;
      })
    )
  }

  return Promise.resolve(BingeProviders)
}).then(providers => {
  return browser.storage.sync.set({
    providers: providers,
  }).then(() => {
    return Promise.resolve(providers)
  })
}).then(providers => {
}).catch(err => {
  console.log(err);
})

browser.tabs.onActivated.addListener((info) => {
  console.log(info)
})

function setActiveTab() {
}

function changeBlockingRules(providers) {
  browser.webRequest.onBeforeRequest.addListener((details) => {
    if (details.initiator) return { cancel: providers.block(details.initiator) }
    if (details.url) return { cancel: providers.block(details.url) }
    return { cancel: false }
  }, {
    urls: providers.getBlockedUrls()
  }, ['blocking']);

  browser.webRequest.handlerBehaviorChanged(() => {
    console.log('Blocking rules changed.')
  });
};

class Services {
  constructor() {
  }
}

class Providers {
  constructor(seed) {
    this.providers = seed;
  }

  loadProviders = () => {
  }
}
