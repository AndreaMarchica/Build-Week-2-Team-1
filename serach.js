const search = document.querySelector('#query')

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

  // Esegui la richiesta solo se il termine di ricerca non è vuoto
  if (searchTerm.trim() !== '') {
    fetch(url + query + searchTerm)
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          if (res.status === 404) {
            throw new Error('404 - Non Trovato')
          } else if (res.status === 500) {
            throw new Error('500 - Errore del Server Interno')
          } else {
            throw new Error('Errore Generico')
          }
        }
      })
      .then((events) => {
        console.log('Risultati della ricerca:', events)
        const data = events.data
        console.log('ecco il risultato', data)
        const row = document.querySelector('#content-row')
        row.innerHTML = ''
        const artistRow = document.querySelector('#artist-row')
        artistRow.innerHTML = ''
        data.forEach((songs) => {
          const newCol = document.createElement('div')
          newCol.classList.add('col', 'col-md-4')
          newCol.innerHTML = `
              <div class="card mb-4 shadow-sm">
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
      .catch((err) => {
        console.log('Errore:', err)
      })
  }
})
