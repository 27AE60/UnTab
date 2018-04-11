import browser from 'browser';
import config from 'config';

import Unsplash, { toJson } from 'unsplash-js';

import defaultImage from  'samagri/default_image.jpg';

const defaultQuery = 'nature trees hills'

const api = new Unsplash({
  applicationId: config.accessKey
})

browser.browserAction.onClicked.addListener((e) => {
  browser.tabs.create({
    url: 'about:newtab'
  }).catch(err => {
    console.log(err)
  })
})

function getQuery(dq) {
  const query = localStorage.getItem('query')
  if (!query) localStorage.setItem('query', dq)
  return query || dq
}

function getDataUri(url, callback) {
  const image = new Image();

  image.crossOrigin = "Anonymous";
  image.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(null, canvas.toDataURL('image/jpeg', 0.9));
  }
  image.onerror = function(err) {
    callback('Unable to get image')
  }
  image.src = url
  // make sure the load event fires for cached images too
  if (image.complete || image.complete === undefined) {
    image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    image.src = url;
  }
}

function fetchImageData() {
  return api.photos.getRandomPhoto({
    width: 1080,
    query: getQuery(defaultQuery)
  }).then(toJson)
}

function saveImageData() {
  return fetchImageData().then(d => {
    console.log(d)
    return new Promise((resolve, reject) => {
      getDataUri(d.urls.regular, (err, val) => {
        if (err) {
          return reject(err)
        }

        try {
          localStorage.setItem('tabimage', val)
          localStorage.setItem('imagedata', JSON.stringify(d))

          return resolve(d)
        } catch(e) {
          return reject(e)
        }
      })
    })
  })
}

browser.alarms.create('fetch-unsplash-image', {
  periodInMinutes: 60 * 5 // refresh every five hours
})

browser.alarms.onAlarm.addListener((a) => {
  if (a.name === 'fetch-unsplash-image') {
    saveImageData().catch(err => {
      console.log(err)
      localStorage.setItem('tabimage', defaultImage)
      localStorage.setItem('imagedata', JSON.stringify(null))
    })
  }
})

browser.runtime.onInstalled.addListener((e) => {
  if (e.reason === 'install' || e.reason === 'update') {
    saveImageData().catch(err => {
      console.log(err)
      localStorage.setItem('tabimage', defaultImage)
      localStorage.setItem('imagedata', JSON.stringify(null))
    })
  }
})
