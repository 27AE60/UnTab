import browser from 'browser'

import 'samagri/newtab.pug'
import 'samagri/newtab.css'

const mainBody = document.getElementById('mainbody')
const photographer = document.getElementById('photographer')
const imageInfo = document.getElementById('option-info')
const optFilter = document.getElementById('option-filter')
const optRefresh = document.getElementById('option-refresh')

function setWallpaper(data) {
  mainBody.style.backgroundImage = data.imageUrl
  imageInfo.href = data.imageLink
  photographer.innerText = data.name
  photographer.href = data.link
}

optFilter.onclick = (e) => {
}

optRefresh.onclick = (e) => {
  browser.runtime.sendMessage({
    action: 'refresh-image'
  }).then((res) => {
    if (res.error) console.log(res)
    else setWallpaper(res.data)
  })
}

browser.runtime.sendMessage({
  action: 'fetch-image'
}).then((res) => {
  if (res.error) console.log(res)
  else setWallpaper(res.data)
})
