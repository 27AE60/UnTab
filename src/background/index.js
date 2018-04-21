import browser from 'browser'
import config from 'config'

import 'whatwg-fetch'
import Unsplash, { toJson } from 'unsplash-js'

import defaultImage from  'samagri/default_image.jpg'

const refreshInterval = 60 * 5
const partSize = 4
const defaultQuery = 'nature trees hills'
const defaultData = {
  imageUrl: 'url(' + defaultImage + ')',
  imageLink: 'https://unsplash.com/photos/QTVbPb6GwYo?utm_source=UnTab&utm_medium=referral',
  link: 'https://unsplash.com/@skatiyar?utm_source=UnTab&utm_medium=referral',
  name: 'Suyash Katiyar'
}

const api = new Unsplash({
  applicationId: config.accessKey
})

browser.browserAction.onClicked.addListener((e) => {
  browser.tabs.create({}).catch(err => {
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
    callback('Unable to get image')
  }
  image.src = url
  // make sure the load event fires for cached images too
  if (image.complete || image.complete === undefined) {
    image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    image.src = url;
  }
}

function getOrientation() {
  const ratio = window.screen.width / window.screen.height
  if (ratio > 1.2) return 'landscape'
  else if (ratio < 0.8) return 'portrait'
  else return 'squarish'
}

function getQuery() {
  return localStorage.getItem('query')
}

function getRequestParams() {
  const query = getQuery()
  const params = {orientation: getOrientation()}
  if (query) params.query = query
  return params
}

function getImageData() {
  return api.photos.getRandomPhoto(
    getRequestParams()
  ).then(toJson).then(d => {
    return new Promise((resolve, reject) => {
      getDataUri(d.urls.regular, (err, val) => {
        if (err) return reject(err)
        else return resolve({data: d, image: val})
      })
    })
  }).then(d => {
    // save the pic information
    localStorage.setItem('imagedata', JSON.stringify(d.data))
    // save last fetch time
    localStorage.setItem('lastfetch', Date.now().toString())

    // save image after spliting it into 4 parts to prevent localStorage size exception
    const regex = new RegExp('.{1,' + Math.ceil(d.image.length / partSize) + '}', 'g');
    const chunks = d.image.match(regex)
    chunks.forEach((e, idx) => {
      localStorage.setItem('image-' + idx, e)
    })

    return Promise.resolve(d)
  })
}

browser.alarms.create('fetch-unsplash-image', {
  periodInMinutes: refreshInterval // refresh every five hours
})

browser.alarms.onAlarm.addListener((a) => {
  if (a.name === 'fetch-unsplash-image') {
    getImageData().catch(err => {
      console.log(err)
    })
  }
})

browser.runtime.onInstalled.addListener((e) => {
  if (e.reason === 'install' || e.reason === 'update') {
    if (e.reason === 'install') localStorage.setItem('query', defaultQuery)
    getImageData().catch(err => {
      console.log(err)
    })
  }
})

browser.runtime.onMessage.addListener((message, sender) => {
  return new Promise((resolve, reject) => {
    if (message.action === 'fetch-image') {
      const picData = localStorage.getItem('imagedata')
      let imgData = null;
      try {
        imgData = JSON.parse(picData)
      } catch(e) {
        console.log(e)
      }
      if (!imgData) {
        return resolve({error: false, data: defaultData})
      }

      let imageUrl = ''
      for (let i = 0; i < partSize; i++) {
        imageUrl += localStorage.getItem('image-' + i)
      }

      resolve({error: false, data: {
        imageUrl: 'url(' + imageUrl + ')',
        imageLink: imgData.links.html + '?utm_source=UnTab&utm_medium=referral',
        link: imgData.user.links.html + '?utm_source=UnTab&utm_medium=referral',
        name: imgData.user.name
      }})

      // check if last load was more than 5 hours ago
      const lastFetch = parseInt(localStorage.getItem('lastfetch'))
      if (isNaN(lastFetch) || Date.now() > lastFetch + (refreshInterval * 60 * 1000)) {
        getImageData().catch(err => {
          console.log(err)
        })
      }
    } else if (message.action === 'refresh-image') {
      return getImageData().then((d) => {
        resolve({error: false, data: {
          imageUrl: 'url(' + d.image + ')',
          imageLink: d.data.links.html + '?utm_source=UnTab&utm_medium=referral',
          link: d.data.user.links.html + '?utm_source=UnTab&utm_medium=referral',
          name: d.data.user.name
        }})
      }).catch(err => {
        console.log(err)
        resolve({error: false, data: defaultData})
      })
    } else if (message.action === 'change-query') {
      if (typeof message.query === 'string') {
        localStorage.setItem('query', message.query)

        return getImageData().then((d) => {
          resolve({error: false, data: {
            imageUrl: 'url(' + d.image + ')',
            imageLink: d.data.links.html + '?utm_source=UnTab&utm_medium=referral',
            link: d.data.user.links.html + '?utm_source=UnTab&utm_medium=referral',
            name: d.data.user.name
          }})
        }).catch(err => {
          console.log(err)
          resolve({error: false, data: defaultData})
        })
      } else {
        reject({error: true, message: 'invalid query string'})
      }
    } else {
      reject({error: true, message: 'invalid action'})
    }
  })
})
