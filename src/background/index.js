import browser from 'browser';
import config from 'config';

import Unsplash, { toJson } from 'unsplash-js';

import defaultImage from  'samagri/default_image.jpg';

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

function getDataUri(url, callback) {
  const image = new Image();

  image.crossOrigin = "Anonymous";
  image.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
    canvas.getContext('2d').drawImage(this, 0, 0);
    callback(null, canvas.toDataURL('image/png'));
  }
  image.onerror = function(err) {
    cb(null, defaultImage)
  }
  image.src = url
  // make sure the load event fires for cached images too
  if ( img.complete || img.complete === undefined ) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = url;
  }
}

function fetchImageData() {
  return api.photos.getRandomPhoto({
    height: 1080,
    query: 'nature trees hills'
  }).then(toJson)
}

function saveImageData() {
  return fetchImageData().then(d => {
    getDataUri(d.urls.custom, (err, val) => {
      if (err) {
        return Promise.reject(err)
      }

      localStorage.setItem('tabimage', val)
      localStorage.setItem('imagedata', JSON.stringify(d))
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
    })
  }
})

browser.runtime.onInstalled.addListener((e) => {
  if (e.reason === 'install' || e.reason === 'update') {
    saveImageData().catch(err => {
      console.log(err)
    })
  }
})
