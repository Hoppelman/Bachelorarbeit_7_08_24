/* Kopciara, Przemysław. In: blog.avada (o.D.): [online] https://blog.avada.io/css/book-effects [abgerufen am 3.08.24] */

var pages = document.getElementsByClassName('page');
var currentPage = 1;
var pageDiv = document.getElementById("pages")
const bookStyles = ["day", "night", "werewolf", "seer", "witch"]


document.addEventListener('DOMContentLoaded', loadPages)

function loadPages() {
  var pages = document.getElementsByClassName('page');

  for(var i = 0; i < pages.length; i++)
  {
    var page = pages[i];
    if (i % 2 === 0)
      {
        page.style.zIndex = (pages.length - i);
      }
  }

  for(var i = 0; i < pages.length; i++)
    {
      //Or var page = pages[i];
      pages[i].pageNum = i + 1;
      pages[i].onclick=function()
        {
          if (this.pageNum % 2 === 0)
            {
              this.classList.remove('flipped');
              this.previousElementSibling.classList.remove('flipped');
              currentPage = currentPage -2;
            }
          else
            {
              this.classList.add('flipped');
              this.nextElementSibling.classList.add('flipped');
              currentPage = currentPage +2;
            }
            console.log(currentPage);//ME
            playAudio(pageTurn_audio, 1.0)
         }
      }
}



//Selektiere die gerade geöffnete Seite und führe ein click Event auf dieser aus
function turnPage() {

  let actionPage = Array.from(pages).find(element => element.pageNum === currentPage)

  actionPage.click()

}

function turnPageDelay() {
  setTimeout(() => {
    turnPage()
  }, 3000)
}

//Blättere "pageNr" Seiten weiter
function turnPages(pageNr) {
  let i = 0;
  let turnTimer = setInterval(() => {
    turnPage()
    i++;
    if(i >= pageNr) clearInterval(turnTimer)
  }, 1000)
}

//Blättert alle Seiten bis zu der letzten um
function turnToEnd() {
  let i = 0;
  /*let turnTimer = setInterval(() => {
    turnPage()
    i++;
    if(i >= pages.length / 2 - 1) clearInterval(turnTimer)
  }, 1000)*/
  while(i < pages.length - 1) {
    //console.log(pages[i])
    if(pages[i].pageNum%2 !== 0) {
      pages[i].click()
    }
    i++;
  }
  //pages[i].click()
}

//Erzeuge eine neue Seite. 
function createPage() {
  console.log(pages)
  let newPage = document.createElement('div');
  newPage.classList.add("page")
  return newPage;
  console.log(newPage)
  pageDiv.appendChild(newPage)
  console.log(pageDiv)
  loadPages()
  console.log(pages)
}

/*<-------- Page creation ----------->*/

function createTitlePage() {
  newPage = createPage();
  newPage.classList.add("titlePage")
}

function addPage(page) {
  pageDiv.appendChild(page)
  newLastPage = createPage()
  //pageDiv.appendChild(newLastPage)
  loadPages()
}

function createIntroPage(intro, image) {
  if(intro.length > 800) {
    leftText = intro.substring(0, 800)
    rightText = intro.substring(800, 1600)
  } else {
    leftText = intro
    rightText = ""
  }

  if(image === undefined || image === "none" || image === null) {
    console.log("Intro image is null")
    image = "/images/MainScreen/marius-returned.jpg"
  }

  leftPage = createPage();
  leftPage.classList.add("introPage")
  let title = document.createElement('h2');
  let text = document.createElement('p');
  text.innerHTML = leftText;
  title.innerHTML = "Die Einwohner Düsterwalds"
  title.classList.add("topic-headline")
  leftPage.appendChild(title)
  leftPage.appendChild(text)
  addPage(leftPage)

  rightPage = createPage();
  let textR = document.createElement('p');
  textR.classList.add("right")
  textR.innerHTML = rightText;
  rightPage.appendChild(textR)
  let img = document.createElement('img');
  img.classList.add("intro")
  img.src = image
  rightPage.appendChild(img)
  addPage(rightPage)
}

function createEntryPage(date, entry) {
  if(entry.length > 800) {
    leftText = entry.substring(0, 800)
    rightText = entry.substring(800, 1600)
  } else {
    leftText = entry
    rightText = ""
  }

  leftPage = createPage();
  leftPage.classList.add("entryPage")
  let title = document.createElement('h2');
  let text = document.createElement('p');
  text.innerHTML = leftText;
  title.innerHTML = date.getDate() + " " + getMonthName(date.getMonth()) + ", Anno Domini 1480"
  title.classList.add("entry-headline")
  leftPage.appendChild(title)
  leftPage.appendChild(text)
  addPage(leftPage)

  rightPage = createPage();
  let textR = document.createElement('p');
  textR.classList.add("right")
  textR.innerHTML = rightText;
  rightPage.appendChild(textR)
  addPage(rightPage)
}

function createSleepPage(image) {
  if(image === undefined || image === "none") {
    image = "/images/MainScreen/evening-ode.jpg"
  }
  leftPage = createPage();
  leftPage.classList.add("sleepPage")
  let title = document.createElement('h2');
  title.classList.add("transition")
  title.innerHTML = "Das Dorf schläft ein..."
  leftPage.appendChild(title)
  addPage(leftPage)

  rightPage = createPage();
  let img = document.createElement('img');
  img.classList.add("sleep")
  img.src = image
  rightPage.appendChild(img)
  //"/images/village/sleep/Night.jpg"
  addPage(rightPage)
}

function createNightPage(image) {
  leftPage = createPage();
  leftPage.classList.add("nightPage")
  let imgL = document.createElement('img');
  imgL.classList.add("flipNight")
  if(image !== undefined && image !== "none") {
    imgL.src = image;
  } else {
    imgL.src = "/images/MainScreen/present-mirth.jpg"
  }
  leftPage.appendChild(imgL)
  addPage(leftPage)

  rightPage = createPage();
  let imgR = document.createElement('img');
  imgR.classList.add("Night")
  if(image !== undefined && image !== "none") {
    imgR.src = image;
  } else {
    imgR.src = "/images/MainScreen/present-mirth.jpg"
  }
  rightPage.appendChild(imgR)
  addPage(rightPage)
}

function createWerewolfPage(image) {
  if(image === undefined || image === "none") {
    console.log("Hello")
    image = "/images/BackUp/Werewolf.png"
  }
  leftPage = createPage();
  leftPage.classList.add("werewolfPage")
  let imgL = document.createElement('img');
  imgL.classList.add("nightL")
  imgL.classList.add("red")
  imgL.src = image
  leftPage.appendChild(imgL)
  addPage(leftPage)

  rightPage = createPage();
  let imgR = document.createElement('img');
  imgR.classList.add("nightR")
  imgR.classList.add("red")
  imgR.src = image
  rightPage.appendChild(imgR)
  addPage(rightPage)
}

function createSeerPage(image) {
  if(image === undefined || image === "none") {
    image = "/images/BackUp/Seer.png"
  }
  console.log(image)
  leftPage = createPage();
  leftPage.classList.add("werewolfPage")
  let imgL = document.createElement('img');
  imgL.classList.add("nightL")
  imgL.classList.add("blue")
  imgL.src = image
  leftPage.appendChild(imgL)
  addPage(leftPage)

  rightPage = createPage();
  let imgR = document.createElement('img');
  imgR.classList.add("nightR")
  imgR.classList.add("blue")
  imgR.src = image;
  rightPage.appendChild(imgR)
  addPage(rightPage)
}

function createWitchPage(image) {
  console.log(image)
  if(image === undefined || image === "none") {
    image = "/images/BackUp/Witch.png"
  }
  leftPage = createPage();
  leftPage.classList.add("werewolfPage")
  let imgL = document.createElement('img');
  imgL.classList.add("nightL")
  imgL.classList.add("green")
  imgL.src = image
  leftPage.appendChild(imgL)
  addPage(leftPage)

  rightPage = createPage();
  let imgR = document.createElement('img');
  imgR.classList.add("nightR")
  imgR.classList.add("green")
  imgR.src = image
  rightPage.appendChild(imgR)
  addPage(rightPage)
}

function createWakePage(image) {
  if(image === undefined || image === "none") {
    image = "/images/MainScreen/return.jpg"
  }
  leftPage = createPage();
  leftPage.classList.add("sleepPage")
  let title = document.createElement('h2');
  title.classList.add("transition")
  title.innerHTML = "Das Dorf wacht auf..."
  leftPage.appendChild(title)
  addPage(leftPage)

  rightPage = createPage();
  let img = document.createElement('img');
  img.classList.add("sleep")
  img.src = image
  rightPage.appendChild(img)
  //"/images/village/sleep/Night.jpg"
  addPage(rightPage)
}

function createDayPage(image) {
  leftPage = createPage();
  let title = document.createElement('h2');
  title.classList.add("transition")
  title.innerHTML = "Die Debatte"
  leftPage.appendChild(title)
  addPage(leftPage)

  rightPage = createPage();
  let imgR = document.createElement('img');
  imgR.classList.add("citizen")
  if(image === undefined || image === "none") {
    imgR.src = "/images/BackUp/Citizen.png"
  } else {
    imgR.src = image;
  }
  rightPage.appendChild(imgR)
  addPage(rightPage)
}

function changeBookStyle(style) {
  let body = document.body
  let book = document.getElementById("book")
  for (let phase in bookStyles) {
    if(body.classList.contains(bookStyles[phase])) {
        body.classList.remove(bookStyles[phase])
    }
  }
  body.classList.add(style)
  for (let phase in bookStyles) {
    if(book.classList.contains(bookStyles[phase])) {
        book.classList.remove(bookStyles[phase])
    }
  }
  book.classList.add(style)
}

function createEndPage(winner, entry) {
  if(entry.length > 800) {
    leftText = entry.substring(0, 800)
    rightText = entry.substring(800, 1600)
  } else {
    leftText = entry
    rightText = ""
  }

  leftPage = createPage();
  leftPage.classList.add("entryPage")
  let title = document.createElement('h2');
  let text = document.createElement('p');
  if(winner === "Werewolf") {
    text.classList.add("Blood")
  }
  text.innerHTML = leftText;
  title.innerHTML = "Das Ende meiner Reise"
  title.classList.add("entry-headline")
  leftPage.appendChild(title)
  leftPage.appendChild(text)
  addPage(leftPage)

  rightPage = createPage();
  let textR = document.createElement('p');
  textR.classList.add("right")
  if(winner === "Werewolf") {
    textR.classList.add("Blood")
  }
  textR.innerHTML = rightText;
  rightPage.appendChild(textR)
  addPage(rightPage)
}

function closeBook() {
  let i = pages.length - 2;

  let turnTimer = setInterval(() => {
    if(pages[i].pageNum%2 === 0) {
      pages[i].click()
    }
    i--;
    if(i < 1) {
      clearInterval(turnTimer)
      setTimeout(() => {
        bookFadeOut()
      }, 1000)
    }
  }, 180)
}

function bookFadeOut() {
  book = document.getElementById("book")
  var opacity = 1; 


  var timer = setInterval(function () { 
      opacity = opacity - 0.01;
      book.style.opacity = opacity;
      if (opacity < 0.05){
          book.style.display = 'none';
          document.getElementById("book-wrapper").style.display = 'none';
          document.getElementById("GameOutro").style.display = "block"
          clearInterval(timer);
      }
  }, 20);
}


function initBook() {
  document.body.classList.add("body-center")
  hideAll();
  book = document.getElementById("book")
  var opacity = 0; 
  book.style.opacity = 0;
  book.style.display = 'block';
  document.getElementById("book-wrapper").style.display = 'block';

  var timer = setInterval(function () { 
      opacity = opacity + 0.01;
      book.style.opacity = opacity;
      if (opacity > 0.9){
          clearInterval(timer);
      }
  }, 20);
}






//Gebe den vollen monatsnamen auf Deutsch zurück
function getMonthName(monthNr) {
  monthNr++;
  let monthName = ""
  switch(monthNr) {
    case 1:
      monthName = "Januar"
      break
    case 2:
      monthName = "Februar"
      break
    case 3:
      monthName = "März"
      break
    case 4:
      monthName = "April"
      break
    case 5:
      monthName = "Mai"
      break
    case 6:
      monthName = "Juni"
      breakanuar
    case 7:
      monthName = "Juli"
      break
    case 8:
      monthName = "August"
      break
    case 9:
      monthName = "September"
      break
    case 10:
      monthName = "Oktober"
      break
    case 11:
      monthName = "November"
      break
    case 12:
      monthName = "Dezember"
      break
  }
  return monthName
}

