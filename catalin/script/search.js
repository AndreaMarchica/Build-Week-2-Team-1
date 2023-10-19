const search = document.querySelector('#query');
const genres = document.getElementById('genreRow');
const row = document.querySelector('#content-row');
const artistRow = document.querySelector('#artist-row');
const artists = document.querySelector('#artists');
const albumRow = document.querySelector('#album-row');
const albums = document.querySelector('#albums');
let artistCardCount = 0;
let albumCardCount = 0;
let songsCardCount = 0;

// AUDIO
const audio = document.getElementById('audio');

const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');

const url = 'https://striveschool-api.herokuapp.com/api/deezer/';

const query = 'search?q=';

search.value = '';

search.addEventListener('input', () => {
	const searchTerm = search.value; // Prendi il valore dell'input
	// console.log('Ricerca:', searchTerm)

	if (searchTerm !== '') {
		genres.classList.add('d-none');
		row.classList.remove('d-none');
		artistRow.classList.remove('d-none');
		artists.classList.remove('d-none');
		albumRow.classList.remove('d-none');
		albums.classList.remove('d-none');
	} else {
		genres.classList.remove('d-none');
		row.classList.add('d-none');
		artistRow.classList.add('d-none');
		artists.classList.add('d-none');
		albumRow.classList.add('d-none');
		albums.classList.add('d-none');
	}

	// Esegui la richiesta solo se il termine di ricerca non è vuoto
	if (searchTerm !== '') {
		fetch(url + query + searchTerm)
			.then((res) => {
				if (res.ok) {
					return res.json();
				} else if (res.status === 404) {
					throw new Error('404 - Non Trovato');
				} else if (res.status === 500) {
					throw new Error('500 - Errore del Server Interno');
				} else {
					throw new Error('Errore Generico');
				}
			})
			.then((events) => {
				// console.log('Risultati della ricerca:', events)
				const data = events.data;
				// console.log('Ecco il risultato', data)
				row.innerHTML = '';
				artistRow.innerHTML = '';
				albumRow.innerHTML = '';
				albumCardCount = 0;
				artistCardCount = 0;
				songsCardCount = 0;

				data.forEach((songs) => {
					const newCol = document.createElement('div');
					newCol.classList.add('col', 'col-12', 'col-sm-3', 'col-xl-2', 'songs');
					if (songsCardCount < 6) {
						newCol.innerHTML = `
            <div class="card mb-4 shadow-sm d-flex">
            <button class="d-flex flex-column songsbutton">
            <img
                src="${songs.album.cover_medium}"
                class="bd-placeholder-img card-img-top rounded w-50 m-2"
              />
              <div class="card-body d-flex flex-column justify-content-between align-items-baseline text-nowrap text-truncate">
                <p class="card-text fw-bold text-nowrap text-truncate m-0">
                  ${songs.title}
                </p>
                <p class="card-text text-nowrap text-truncate mb-0 mt-3">
                  ${songs.artist.name}
                </p>
                <div
                  class="d-flex justify-content-between align-items-center"
                >
                 
                </div>
              </div>
              </button>
            </div>
          `;
						row.appendChild(newCol);
					}
					songsCardCount++;
					const startsongs = document.querySelectorAll('.songsbutton');
					startsongs.forEach((startsong, index) => {
						startsong.addEventListener('click', (e) => {
							e.preventDefault();
							const player = document.querySelector('.player-bar');
							player.classList.remove('d-none');

							const song1 = data[index];
							// console.log('ciap', song1)

							const albumCover = document.getElementById('albumCover');
							albumCover.src = song1.album.cover_medium;

							const songName = document.getElementById('songName');
							songName.innerText = song1.title;

							const artistName = document.getElementById('artistName');
							artistName.innerText = song1.artist.name;

							let isPlaying = false;

							playButton.addEventListener('click', () => {
								if (!isPlaying) {
									audio.play();
									isPlaying = true;
									playButton.style.display = 'none';
									pauseButton.style.display = 'block';
								}
							});

							pauseButton.addEventListener('click', () => {
								if (isPlaying) {
									audio.pause();
									isPlaying = false;
									pauseButton.style.display = 'none';
									playButton.style.display = 'block';
								}
							});

							nextButton.addEventListener('click', () => {
								// Aggiungi la logica per passare alla prossima traccia
								// console.log('next')
							});

							prevButton.addEventListener('click', () => {
								// Aggiungi la logica per tornare alla traccia precedente
							});

							const repeat = document.querySelector('#repeat');
							const repeatIcon = document.querySelector('#repeaticon');

							repeat.addEventListener('click', () => {
								if (audio.loop) {
									repeatIcon.classList.remove('fillactive');
									audio.loop = false;
								} else {
									repeatIcon.classList.add('fillactive');
									audio.loop = true;
								}
							});

							audio.addEventListener('ended', () => {
								playButton.style.display = 'block';
								pauseButton.style.display = 'none';
								audio.currentTime = 0;
								progress.style.width = '0%';
								if (!isPlaying) {
									audio.play();
									isPlaying = true;
									playButton.style.display = 'none';
									pauseButton.style.display = 'block';
								} else if (isPlaying) {
									audio.pause();
									isPlaying = false;
									pauseButton.style.display = 'none';
									playButton.style.display = 'block';
								}
							});

							// PROGRESS

							const progress = document.getElementById('progress');
							const progressBar = document.getElementById('progress-bar');

							audio.addEventListener('timeupdate', () => {
								const currentTime = audio.currentTime;
								const duration = audio.duration;
								const progressPercent = (currentTime / duration) * 100;
								progress.style.width = progressPercent + '%';
							});

							progressBar.addEventListener('click', (e) => {
								const progressBarRect = progressBar.getBoundingClientRect();
								const clickX = e.clientX - progressBarRect.left;
								const progressBarWidth = progressBarRect.width;
								const newTime = (clickX / progressBarWidth) * audio.duration;
								audio.currentTime = newTime;
							});

							// VOLUME

							let initialVolume;
							let isMuted = false; // Stato iniziale del volume
							const range = document.getElementById('volume-range');
							const volume = document.getElementById('volume');

							const song = document.getElementById('audio');
							song.src = song1.preview;
							audio.play();
							isPlaying = true;
							playButton.style.display = 'none';
							pauseButton.style.display = 'block';

							// Aggiungi un evento di ascolto per il cambio del valore del range
							range.addEventListener('input', () => {
								// Aggiorna il volume audio con il valore del range
								audio.volume = range.value / 100;
								// Aggiorna il valore iniziale quando modifichi il range
								initialVolume = range.value / 100;
							});

							volume.addEventListener('click', () => {
								if (isMuted) {
									// Se è già stato disattivato, ripristina il valore iniziale
									range.value = initialVolume * 100;
									audio.volume = initialVolume;
									isMuted = false;
								} else {
									// Salva il valore corrente come valore iniziale, disattiva il volume
									initialVolume = range.value / 100;
									audio.volume = 0;
									range.value = 0;
									isMuted = true;
								}
							});
						});
					});
				});

				const uniqueData = {};

				data.forEach((songs) => {
					if (!uniqueData[songs.artist.id] && artistCardCount < 8) {
						uniqueData[songs.artist.id] = songs;

						// Verifica se il nome dell'artista corrisponde alla tua ricerca
						const artistName = songs.artist.name.toLowerCase();
						const searchTerm = search.value.toLowerCase(); // Assumo che search sia l'input di ricerca

						const newArtistCol = document.createElement('div');
						newArtistCol.classList.add(
							'col',
							'col-12',
							'col-sm-3',
							'col-md-2',
							'artist-album'
						);

						const fullName = songs.artist.name.replace(/ /g, '');

						newArtistCol.innerHTML = `
            <a href=artist.html?artistName=${fullName}>
            <div class="card shadow-sm d-flex h-100">
            <div class="d-flex justify-content-center">
            <img
              src="${songs.artist.picture_medium}"
              class="bd-placeholder-img card-img-top rounded-circle m-2 shadow-lg"
            />
            </div>
            <div class="card-body d-flex flex-column justify-content-between pt-0">
              <p class="card-text text-nowrap text-truncate mb-0 fw-bold fs-5">
                ${songs.artist.name}
              </p>
              <p class="card-text text-nowrap text-truncate m-0 text-muted">
                ${songs.artist.type}
              </p>
            </div>
          </div>
          </a>
        `;

						if (artistName.includes(searchTerm)) {
							// Se il nome dell'artista corrisponde alla ricerca, inseriscilo all'inizio
							artistRow.insertBefore(newArtistCol, artistRow.firstChild);
						} else {
							// Altrimenti, inseriscilo in coda
							artistRow.appendChild(newArtistCol);
						}

						artistCardCount++;
					}
				});

				const uniqueAlbum = {};

				data.forEach((album) => {
					if (!uniqueAlbum[album.artist.id] && albumCardCount < 8) {
						uniqueAlbum[album.artist.id] = album;
						// console.log('ecco i tuoi album', album)

						// Verifica se il nome dell'artista corrisponde alla tua ricerca
						const albumName = album.artist.name.toLowerCase();
						const searchTerm = search.value.toLowerCase(); // Assumo che search sia l'input di ricerca

						const newAlbumCol = document.createElement('div');
						newAlbumCol.classList.add(
							'col',
							'col-12',
							'col-sm-3',
							'col-md-2',
							'artist-album'
						);
						newAlbumCol.innerHTML = `
            <a href='album.html?albumId=${album.album.id}'>
            <div class="card shadow-sm d-flex h-100">
            <div class="d-flex justify-content-center">
            <img
              src="${album.album.cover_medium}"
              class="bd-placeholder-img card-img-top rounded-circle m-2 shadow-lg"
            />
            </div>
            <div class="card-body d-flex flex-column justify-content-between pt-0">
              <p class="card-text text-nowrap text-truncate mb-0 fw-bold fs-5">
                ${album.album.title}
              </p>
              <p class="card-text text-nowrap text-truncate m-0 text-muted">
                ${album.album.type}
              </p>
            </div>
          </div>
          </a>
        `;

						if (albumName.includes(searchTerm)) {
							// Se il nome dell'artista corrisponde alla ricerca, inseriscilo all'inizio
							albumRow.insertBefore(newAlbumCol, albumRow.firstChild);
						} else {
							// Altrimenti, inseriscilo in coda
							albumRow.appendChild(newAlbumCol);
						}

						albumCardCount++;
					}
				});
			})

			.catch((error) => {
				console.error('Errore durante la richiesta:', error);
			});
	} else {
		// Se il termine di ricerca è vuoto, nascondi le carte e mostra genreRow
		genres.classList.remove('d-none');
		row.classList.add('d-none');
		artistRow.classList.add('d-none');
		albumRow.classList.add('d-none');
		albums.classList.add('d-none');
	}
});
