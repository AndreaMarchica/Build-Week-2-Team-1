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
