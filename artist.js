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
      fieldCarousel(data)
      // fillArtistSongs(data)
      // fillSongsRank(data)
      // fillSongsDuration(data)
      generateArtist(data)
      aumentaNum()
    })
    .catch((err) => {
      console.log('Si è verificato un errore:', err)
    })
}
getData()

const fieldCarousel = (arrayOfSongs) => {
  const idImg1 = document.getElementById('img1')
  const idImg2 = document.getElementById('img2')
  const idImg3 = document.getElementById('img3')
  const allArtistName = document.querySelectorAll('.carousel-caption h5')
  const allArtistLink = document.querySelectorAll('.carousel-caption p')

  arrayOfSongs.forEach((data) => {
    idImg1.src = `${data.artist.picture_xl}`
    allArtistName.forEach((nome) => {
      nome.innerHTML = `<h2>${data.artist.name}</h2>`
    })
    // allArtistLink.forEach((link) => {
    //   link.innerHTML = `<a href="${data.artist.link}"><p>Discografia</p></a>`
    // })
    idImg2.src = `${data.artist.picture_xl}`
    idImg3.src = `${data.artist.picture_xl}`
  })
}

// const fillArtistSongs = function (arrayOfSongs) {
//   arrayOfSongs.forEach((data) => {
//     const olTracks = document.getElementById('ol-tracks')
//     const newSongsDiv = document.createElement('div')
//     // newSongsDiv.classList.add("d-flex");
//     const newLiTracks = document.createElement('li')
//     newLiTracks.classList.add('d-flex')
//     newLiTracks.innerHTML = `<img src="${data.album.cover_small}"/> <p>${data.title}</p>`
//     newSongsDiv.appendChild(newLiTracks)
//     olTracks.appendChild(newSongsDiv)
//   })
// }

// const fillSongsRank = function (arrayOfSongs) {
//   arrayOfSongs.forEach((data) => {
//     const ulRank = document.getElementById('ul-rank')
//     const newLiRank = document.createElement('li')
//     newLiRank.classList.add('mb-5')
//     newLiRank.innerText = `${data.rank}`
//     ulRank.appendChild(newLiRank)
//   })
// }
// const fillSongsDuration = function (arrayOfSongs) {
//   arrayOfSongs.forEach((data) => {
//     const ulDuration = document.getElementById('ul-duration')
//     const newLiDuration = document.createElement('li')
//     const time = `${data.duration}`
//     const minutes = Math.floor(time / 60)
//     const seconds = time - minutes * 60
//     newLiDuration.innerText = `${minutes} : ${seconds}`
//     ulDuration.appendChild(newLiDuration)
//     console.log(data.duration)
//   })
// }
// const minutes = Math.floor(time / 60);
// const seconds = time - minutes * 60;
// console.log(seconds);

const generateArtist = (arrayOfSongs) => {
  arrayOfSongs.forEach((data) => {
    const row = document.getElementById('special-row')
    const newColTrack = document.createElement('div')
    newColTrack.classList.add('col-6', 'my-2')
    const newColRank = document.createElement('div')
    newColRank.classList.add('col-3')
    const newColDuration = document.createElement('div')
    newColDuration.classList.add('col-3')

    // const numberPhotoArtist = function () {
    //   let x = 0

    //   return x++
    // }
    const aumentaNum = function () {
      let numProgressivo = 0
      // numProgressivo++
      return numProgressivo++
    }

    newColTrack.innerHTML = `
    <div class="d-flex align-items-center">
    <p class="m-0">${aumentaNum()}</p>
    <img src="${data.album.cover_small}" class="mx-3">
    <p class="m-0">${data.title}</p>
    </div>
    `
    newColRank.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${data.rank}</p></div>`
    const time = `${data.duration}`
    const minutes = Math.floor(time / 60)
    const seconds = time - minutes * 60
    newColDuration.innerHTML = `<div class="d-flex align-items-center h-100"><p class="m-0">${minutes} : ${seconds}</p></div>`
    row.appendChild(newColTrack)
    row.appendChild(newColRank)
    row.appendChild(newColDuration)
  })
}
