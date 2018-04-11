import 'samagri/newtab.pug'
import 'samagri/newtab.css'

const mainBody = document.getElementById('mainbody');

const tabImage = localStorage.getItem('tabimage');
const imageAuthor = localStorage.getItem('imageauthor');

const imageUrl = 'url(' + tabImage + ')';
mainBody.style.backgroundImage = imageUrl;
