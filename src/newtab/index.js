import browser from 'browser'

import 'samagri/newtab.pug'
import 'samagri/newtab.css'

const mainBody = document.getElementById('mainbody')
const photographer = document.getElementById('photographer')
const imageInfo = document.getElementById('option-info')
const optFilter = document.getElementById('option-filter')
const optRefresh = document.getElementById('option-refresh')
const queryBox = document.getElementById('query-box')
const queryInput = document.getElementById('query-input')
const querySave = document.getElementById('query-save')
const closeQueryBox = document.getElementById('close-query-box')

function setWallpaper(data) {
  mainBody.style.backgroundImage = data.imageUrl
  imageInfo.href = data.imageLink
  photographer.innerText = data.name
  photographer.href = data.link
}

optFilter.onclick = (e) => {
  const query = localStorage.getItem('query')
  queryInput.value = query
  queryBox.style.visibility = 'visible'
  querySave.onclick = (e) => {
    const newQuery = queryInput.value

    queryBox.style.visibility = 'hidden'
    querySave.onclick = null

    browser.runtime.sendMessage({
      action: 'change-query',
      query: newQuery
    }).then((res) => {
      if (res.error) console.log(res)
      else setWallpaper(res.data)
    })
  }
}

closeQueryBox.onclick = (e) => {
  queryBox.style.visibility = 'hidden'
  querySave.onclick = null
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
