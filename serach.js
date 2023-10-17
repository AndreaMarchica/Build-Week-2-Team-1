const search = document.querySelector('#query')
const genres = document.getElementById('genreRow')
const row = document.querySelector('#content-row')
const artistRow = document.querySelector('#artist-row')
const artists = document.querySelector('#artists')
const mostRelevant = document.querySelector('#songcontainer')
// search.addEventListener('input', (e) => {
//   const searched = e.target.value
//   console.log(searched)
// })

const url = 'https://striveschool-api.herokuapp.com/api/deezer/'

const query = 'search?q='

// const card = ''
// console.log('il tuo url', url)
// console.log(query)

search.addEventListener('input', () => {
  const searchTerm = search.value // Prendi il valore dell'input
  console.log('Ricerca:', searchTerm)

  if (searchTerm !== '') {
    genres.classList.add('d-none')
    row.classList.remove('d-none')
    mostRelevant.classList.remove('d-none')
    artistRow.classList.remove('d-none')
    artists.classList.remove('d-none')
  } else {
    genres.classList.remove('d-none')
    row.classList.add('d-none')
    mostRelevant.classList.add('d-none')
    artistRow.classList.add('d-none')
    artists.classList.add('d-none')
  }

  // Esegui la richiesta solo se il termine di ricerca non è vuoto
  if (searchTerm !== '') {
    fetch(url + query + searchTerm)
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else if (res.status === 404) {
          throw new Error('404 - Non Trovato')
        } else if (res.status === 500) {
          throw new Error('500 - Errore del Server Interno')
        } else {
          throw new Error('Errore Generico')
        }
      })
      .then((events) => {
        console.log('Risultati della ricerca:', events)
        const data = events.data
        console.log('Ecco il risultato', data)
        row.innerHTML = ''
        mostRelevant.innerHTML = ''
        artistRow.innerHTML = ''
        data.forEach((songs) => {
          const newCol = document.createElement('div')
          newCol.classList.add('col', 'd-flex')
          newCol.innerHTML = `
            <div class="card mb-4 shadow-sm d-flex">
              <img
                src="${songs.album.cover_medium}"
                class="bd-placeholder-img card-img-top"
              />
              <div class="card-body">
                <p class="card-text">
                  ${songs.title}
                </p>
                <div
                  class="d-flex justify-content-between align-items-center"
                >
                  <div class="btn-group">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `
          row.appendChild(newCol)
          console.log(songs.type)
        })

        const uniqueData = {}

        data.forEach((songs) => {
          if (!uniqueData[songs.artist.id]) {
            uniqueData[songs.artist.id] = songs
            // console.log('0424', songs)

            // Verifica se il nome dell'artista corrisponde alla tua ricerca
            const artistName = songs.artist.name.toLowerCase()
            const searchTerm = search.value.toLowerCase() // Assumo che search sia l'input di ricerca

            const newArtistCol = document.createElement('div')
            newArtistCol.classList.add('col', 'col-md-4')
            newArtistCol.innerHTML = `
                          <div class="card mb-4 shadow-sm">
                            <img
                              src="${songs.artist.picture}"
                              class="bd-placeholder-img card-img-top"
                            </img>
                          </div>             
                      `

            if (artistName.includes(searchTerm)) {
              // Se il nome dell'artista corrisponde alla ricerca, inseriscilo all'inizio
              artistRow.insertBefore(newArtistCol, artistRow.firstChild)
            } else {
              // Altrimenti, inseriscilo in coda
              artistRow.appendChild(newArtistCol)
            }

            console.log('ciaoo', songs.artist.picture)
          }
        })
      })
      .catch((error) => {
        console.error('Errore durante la richiesta:', error)
      })
  } else {
    // Se il termine di ricerca è vuoto, nascondi le carte e mostra genreRow
    genres.classList.remove('d-none')
    row.classList.add('d-none')
    artistRow.classList.add('d-none')
    mostRelevant.classList.add('d-none')
  }
})
