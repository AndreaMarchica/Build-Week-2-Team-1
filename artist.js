const getData = function () {
  const myUrl =
    'https://striveschool-api.herokuapp.com/api/deezer/search?q=marcomasini'
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

    const artistInfo = document.getElementById('artist-info')
    artistInfo.innerHTML = `
      <p class="mb-0"><i class="bi bi-patch-check-fill me-2"></i>Artista verificato</p>
      <h1 style="font-size:3em; font-weight:bold">${data.artist.name}</h1>
      <a href="${data.artist.link}">Scopri su deezer</a>
      `

    newColTrack.innerHTML = `
    <div class="d-flex align-items-center">
    <p class="m-0">${numero}</p>
    <img src="${data.album.cover_small}" class="mx-3">
    <p class="m-0">${data.title}</p>
    </div>
    `
    numero++
    //numero++ Per incrementare il numero artista
    newColRank.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${data.rank}</p></div>`
    const time = `${data.duration}`
    const minutes = Math.floor(time / 60)
    const seconds = (time % 60).toString().padStart(2, '0')

    newColDuration.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${minutes} : ${seconds}</p></div>`
    row.appendChild(newColTrack)
    row.appendChild(newColRank)
    row.appendChild(newColDuration)
  })
}

const generateLikeTracks = function (arrayOfSongs) {
  arrayOfSongs.forEach((data) => {
    const imageCol = document.getElementById('like-image')
    const textCol = document.getElementById('like-text')
    imageCol.innerHTML = `
    <div class="position-absolute">
    <img class='rounded-circle align-items-center w-25' src='${data.artist.picture_medium}'/>
    
    <div class="position-absolute  translate-middle ciao bg-success rounded-circle">
    <i class="bi bi-heart-fill  ciao2"></i>
    </div>
    </div>
    `
    textCol.innerHTML = `<p class='mb-0'>Hai messo Mi piace a 11 brani</p>
<p class='fs-6 opacity-50'>Di ${data.artist.name}</p>`
  })
}
