const getData = function () {
  const myUrl =
    'https://striveschool-api.herokuapp.com/api/deezer/search?q=ladygaga'
  fetch(myUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        if (res.status === 404) {
          throw new Error('404 - Not Found')
        } else if (res.status === 500) {
          throw new Error('500 - Internal Server Error')
        } else {
          throw new Error('Generic ERROR')
        }
      }
    })
    .then((song) => {
      console.log('API SPOTY', song)
      const data = song.data
      generateArtist(data)
      generateLikeTracks(data)
    })
    .catch((err) => {
      console.log('Si è verificato un errore:', err)
    })
}
getData()

const generateArtist = (arrayOfSongs) => {
  let numero = 1
  // variabile contatore track
  arrayOfSongs.forEach((data) => {
    const row = document.getElementById('special-row')
    const newColTrack = document.createElement('div')
    newColTrack.classList.add('col-8', 'my-2')
    const newColRank = document.createElement('div')
    newColRank.classList.add('col-2')
    const newColDuration = document.createElement('div')
    newColDuration.classList.add('col-2')
    const backgroundArtistDiv = document.getElementById('background-artist')
    backgroundArtistDiv.style.backgroundImage = `url(${data.artist.picture_xl})`
    backgroundArtistDiv.style.backgroundColor = 'gray'

    // sezione alta info autore
    const artistInfo = document.getElementById('artist-info')
    artistInfo.innerHTML = `
      <p class="mb-0"><i class="bi bi-patch-check-fill me-2"></i>Artista verificato</p>
      <h1 style="font-size:3em; font-weight:bold">${data.artist.name}</h1>
      <a href="${data.artist.link}">Scopri su deezer</a>
      `

    // creo la colonna track
    newColTrack.innerHTML = `
    <div class="d-flex align-items-center">
    <p class="m-0">${numero}</p>
    <img src="${data.album.cover_small}" class="mx-3">
    <p class="m-0">${data.title}</p>
    </div>
    `
    numero++
    //numero++ Per incrementare il numero artista

    // creo la colonna rank
    newColRank.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${data.rank}</p></div>`

    // creo la colonna duration
    const time = `${data.duration}`
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60).toString().padStart(2, '0')
    newColDuration.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${minutes} : ${seconds}</p></div>`

    // appendo il tutto
    row.appendChild(newColTrack)
    row.appendChild(newColRank)
    row.appendChild(newColDuration)

    //  nascondo le track dalla 6 in poi
    if (numero > 6) {
      newColTrack.classList.add('d-none')
      newColRank.classList.add('d-none')
      newColDuration.classList.add('d-none')
    }

    // pulsante mostra altro
    const showButton = document.getElementById('show')
    showButton.addEventListener('click', function () {
      newColTrack.classList.remove('d-none')
      newColRank.classList.remove('d-none')
      newColDuration.classList.remove('d-none')
      showButton.classList.add('d-none')
    })
  })
}

// creo la colonna dei like
const generateLikeTracks = function (arrayOfSongs) {
  arrayOfSongs.forEach((data) => {
    const imageCol = document.getElementById('like-image')
    const textCol = document.getElementById('like-text')
    imageCol.innerHTML = `
   <div>
     <button  id='icon-button'
       type="button"
       class="position-relative border border-none rounded-circle"
       disabled aria-label="Close"
     >
       <i
         id="beppe"
         class="bi bi-heart-fill text-white position-absolute translate-middle p-2 bg-success border-light rounded-circle"
       >
       </i>
     </button>
   </div>
 `
    const iconImage = document.getElementById('icon-button')
    iconImage.style.backgroundImage = `url(${data.artist.picture})`
    textCol.innerHTML = `<p class='mb-0'>Hai messo Mi piace a 11 brani</p>
<p class='fs-6 opacity-50'>Di ${data.artist.name}</p>`
  })
}

// const showButton = document.getElementById("show");
// const showAll = function () {
//   newColTrack.classList.remove("d-none");
//   newColRank.classList.remove("d-none");
//   newColDuration.classList.remove("d-none");
// };
