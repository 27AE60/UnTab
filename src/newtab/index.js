import 'samagri/newtab.pug'
import 'samagri/newtab.css'

const mainBody = document.getElementById('mainbody')
const photographer = document.getElementById('photographer')
const imageInfo = document.getElementById('option-info')
const optFilter = document.getElementById('option-filter')
const optRefresh = document.getElementById('option-refresh')

function setWallpaper(data) {
  mainBody.style.backgroundImage = data.imageUrl
  photographer.innerText = data.name
  photographer.href = data.link
  imageInfo.href = data.imageLink
}

const tabImage = localStorage.getItem('tabimage')
const picData = localStorage.getItem('imagedata')

let imgData = null;
try {
  imgData = JSON.parse(picData)
} catch(e) {
  console.log(e)
}

if (!imgData) {
  imgData = {
    user: {
      username: 'skatiyar',
      links: {
        html: 'https://unsplash.com/@skatiyar'
      }
    },
    links: {
      html: 'https://unsplash.com/photos/QTVbPb6GwYo'
    }
  }
}

const imageUrl = 'url(' + tabImage + ')'
const imageLink = imgData.links.html + '?utm_source=UnTab&utm_medium=referral'
const imagePhotographer = '@' + imgData.user.username;
const photographerLink = imgData.user.links.html + '?utm_source=UnTab&utm_medium=referral'

setWallpaper({
  imageUrl: imageUrl,
  imageLink: imageLink,
  name: imagePhotographer,
  link: photographerLink
})
