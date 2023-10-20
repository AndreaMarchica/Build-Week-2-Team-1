const addressBarContent = new URLSearchParams(location.search);

const artistName = addressBarContent.get('artistName');

const audio = document.getElementById('audio');

const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const player = document.querySelector('.player-bar');
const showButton = document.getElementById('show');

const getData = function () {
	const myUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=' + artistName;
	fetch(myUrl, {
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.then((res) => {
			if (res.ok) {
				return res.json();
			} else {
				if (res.status === 404) {
					throw new Error('404 - Not Found');
				} else if (res.status === 500) {
					throw new Error('500 - Internal Server Error');
				} else {
					throw new Error('Generic ERROR');
				}
			}
		})
		.then((song) => {
			console.log('API SPOTY', song);
			const data = song.data;
			generateArtist(data);
			generateLikeTracks(data);
		})
		.catch((err) => {
			console.log('Si è verificato un errore:', err);
		});
};
getData();

const generateArtist = (arrayOfSongs) => {
	let numero = 1;
	// variabile contatore track
	arrayOfSongs.forEach((data) => {
		const row = document.getElementById('special-row');
		const newColTrack = document.createElement('div');
		newColTrack.classList.add('col-8', 'my-2');
		const newColRank = document.createElement('div');
		newColRank.classList.add('col-2');
		const newColDuration = document.createElement('div');
		newColDuration.classList.add('col-2', 'd-flex', 'justify-content-center');
		const backgroundArtistDiv = document.getElementById('background-artist');
		backgroundArtistDiv.style.backgroundImage = `url(${data.artist.picture_xl})`;
		backgroundArtistDiv.style.backgroundColor = 'gray';

		// sezione alta info autore
		const artistInfo = document.getElementById('artist-info');
		artistInfo.innerHTML = `
      <p class="mb-0"><svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect width='24' height='24' stroke='none' fill='#000000' opacity='0'/>


      <g transform="matrix(0.42 0 0 0.42 12 12)" >
      <g style="" >
      <g transform="matrix(1 0 0 1 0 0)" >
      <polygon style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(66,165,245); fill-rule: nonzero; opacity: 1;" points="5.62,-21 9.05,-15.69 15.37,-15.38 15.69,-9.06 21,-5.63 18.12,0 21,5.62 15.69,9.05 15.38,15.37 9.06,15.69 5.63,21 0,18.12 -5.62,21 -9.05,15.69 -15.37,15.38 -15.69,9.06 -21,5.63 -18.12,0 -21,-5.62 -15.69,-9.05 -15.38,-15.37 -9.06,-15.69 -5.63,-21 0,-18.12 " />
      </g>
      <g transform="matrix(1 0 0 1 -0.01 0.51)" >
      <polygon style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" points="-2.6,6.74 -9.09,0.25 -6.97,-1.87 -2.56,2.53 7,-6.74 9.09,-4.59 " />
      </g>
      </g>
      </g>
      </svg>Artista verificato</p>
      <h1 style="font-size:3em; font-weight:bold">${data.artist.name}</h1>
      <a href="${data.artist.link}">Scopri su Deezer</a>
      `;

		// creo la colonna track
		newColTrack.innerHTML = `
		<a class="song" style="text-decoration:none; color:white; cursor:pointer">
    <div class="d-flex align-items-center">
    <p class="m-0">${numero}</p>
    <img src="${data.album.cover_small}" class="mx-3">
    <div class="d-flex flex-column ">
    <p class="m-0 fs-5  ">${data.title}</p>
    <p class="m-0 fs-6 d-md-none opacity-50 ">${data.rank}</p>
</div>
    </div></a>
    `;
		numero++;
		//numero++ Per incrementare il numero artista

		const startsongs = document.querySelectorAll('.song');
		// startsongs.addEventListener('click', () => {
		//
		// })
		startsongs.forEach((startsong, index) => {
			startsong.addEventListener('click', (e) => {
				e.preventDefault();
				showButton.classList.add('pb-5');
				showButton.closest('div').classList.add('pb-5');

				player.classList.remove('d-none');

				const data1 = arrayOfSongs[index];

				const albumCover = document.getElementById('albumCover');
				albumCover.src = data1.album.cover_medium;

				const songName = document.getElementById('songName');
				songName.innerText = data1.title;

				const artistName = document.getElementById('artistName');
				artistName.innerText = data1.artist.name;

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
				song.src = data1.preview;
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

		// creo la colonna rank
		newColRank.innerHTML = `<div class="d-flex d-none d-md-block align-items-center h-100"><p class="m-0">${data.rank}</p></div>`;

		// creo la colonna duration
		const time = `${data.duration}`;
		const minutes = Math.floor(time / 60);
		const seconds = (time % 60).toString().padStart(2, '0');
		newColDuration.innerHTML = `<div class="d-flex d-none d-md-block align-items-center h-100"><p class="m-0">${minutes} : ${seconds}</p></div>
    <div><i class="bi bi-three-dots-vertical d-md-none"></i></div>`;

		// appendo il tutto
		row.appendChild(newColTrack);
		row.appendChild(newColRank);
		row.appendChild(newColDuration);

		//  nascondo le track dalla 6 in poi
		if (numero > 6) {
			newColTrack.classList.add('d-none');
			newColRank.classList.add('d-none');
			newColDuration.classList.add('d-none');
		}

		// pulsante mostra altro

		showButton.addEventListener('click', function () {
			if (player) newColTrack.classList.remove('d-none');
			newColRank.classList.remove('d-none');
			newColDuration.classList.remove('d-none');
			showButton.classList.add('d-none');
		});
	});
};

// creo la colonna dei like
const generateLikeTracks = function (arrayOfSongs) {
	arrayOfSongs.forEach((data) => {
		const imageCol = document.getElementById('like-image');
		const textCol = document.getElementById('like-text');
		imageCol.innerHTML = `
   <div class='row d-flex align-items-center  justify-content-md-between'>
	 <div class=" rounded-pill me-0 position-relative col-3">
	 <img
		 class="rounded-pill"
		 src="${data.artist.picture}"
		 width="75px"
		 height="75px"
		 alt="avatar logo" />
	 <div class="position-absolute" id="div-like">
		 <i
			 id="beppe2"
			 class="bi bi-heart-fill text-white p-2 bg-success border-light rounded-circle">
		 </i>
	 </div>
 </div>
<div class='col-8 ps-0'>
<h5 class="d-md-none mb-0">Brani che ti piacciono</h5>
<p class="d-md-none mb-0 ">11 brani di ${data.artist.name}</p>
 <p class='mb-0 d-none d-md-block '>Hai messo Mi piace a 11 brani</p>
<p class='fs-6 opacity-50 m-0 d-none d-md-block'>Di ${data.artist.name}</p>
</div>
   </div>
 `;
		const iconImage = document.getElementById('icon-button');

		textCol.innerHTML = ``;
	});
};

// const showButton = document.getElementById("show");
// const showAll = function () {
//   newColTrack.classList.remove("d-none");
//   newColRank.classList.remove("d-none");
//   newColDuration.classList.remove("d-none");
// };

const close = () => {
	const close = document.getElementById('close');
	const friends = document.getElementById('friends');
	close.addEventListener('click', (e) => {
		e.preventDefault();
		friends.classList.remove('d-md-block');
	});
};
close();
