const addressBarContent = new URLSearchParams(location.search);
// const albumId = addressBarContent.get('albumId');
const albumId = 9410110;
//  92201 9410110
// crea un canvas con l'immagine e ne ritorno il context 2d
const draw = function (img) {
	let canvas = document.createElement('canvas');
	let c = canvas.getContext('2d');
	c.width = canvas.width = img.clientWidth;
	c.height = canvas.height = img.clientHeight;
	c.clearRect(0, 0, c.width, c.height);
	c.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
	return c;
};

// scompone pixel per pixel e ritorna un oggetto con una mappa della loro frequenza nell'immagine
const getColors = function (c) {
	let col,
		colors = {};
	let pixels, r, g, b, a;
	r = g = b = a = 0;
	pixels = c.getImageData(0, 0, c.width, c.height);
	for (let i = 0, data = pixels.data; i < data.length; i += 4) {
		r = data[i];
		g = data[i + 1];
		b = data[i + 2];
		a = data[i + 3];
		if (a < 255 / 2) continue;
		col = rgbToHex(r, g, b);
		if (!colors[col]) colors[col] = 0;
		colors[col]++;
	}
	return colors;
};

// trova il colore più ricorrente data una mappa di frequenza dei colori
const findMostRecurrentColor = function (colorMap) {
	let highestValue = 0;
	let mostRecurrent = null;
	for (const hexColor in colorMap) {
		if (colorMap[hexColor] > highestValue) {
			mostRecurrent = hexColor;
			highestValue = colorMap[hexColor];
		}
	}
	return mostRecurrent;
};

// converte un valore in rgb a un valore esadecimale
const rgbToHex = function (r, g, b) {
	if (r > 255 || g > 255 || b > 255) {
		throw 'Invalid color component';
	} else {
		return ((r << 16) | (g << 8) | b).toString(16);
	}
};

// inserisce degli '0' se necessario davanti al colore in esadecimale per renderlo di 6 caratteri
const pad = function (hex) {
	return ('000000' + hex).slice(-6);
};

const albums = (album) => {
	const albumPosition = document.getElementById('here');
	const year = album.release_date.slice(0, 4);
	const myDiv = document.createElement('div');
	myDiv.innerHTML = `
    <div id="album-main">
    <div class="card-album mb-3"">
    <div class="row g-0 justify-content-center justify-content-md-start">
      <div
        class="col-4 col-md-4 album-img justify-content-center d-flex shadow-img ms-4 ">
        <img src="${
				album.cover_big
			}" alt="cover" onload="start()" crossorigin="anonymous" id='img'"/>
      </div>
      <div class="col-md-7 d-flex">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="flex-grow-1" id="empty-space"></div>
          <p class="card-text fs-6 fw-bolder m-0 d-none d-md-block">${album.record_type}</p>
          <h4 class="card-title fs-1 mt-2 fw-bold ps-5 ps-md-0" id="album">${album.title}</h4>
          <div class="flex-grow-1" id="empty-space"></div>
          <div class="d-flex ps-5 py-3 ps-md-0 p7-md-0">
            <img
              class="rounded-pill me-2"
              src="${album.artist.picture}"
              width="20"
              height="20"
              alt="aalbum logo" />
            <p class="card-text m-0">
						<span class='d-block d-md-none'>${album.artist.name}   </span>
              <small class="text-body-white fw-bold m-0 d-none d-md-block ">
                ${album.artist.name} ・${album.release_date}・${album.nb_tracks} Brani,<span
                  class="text-secondary"
                  >${timingComplete(album.duration)}</span
                >
              </small>
							<span class='d-block d-md-none text-secondary'>${album.record_type} ・ ${year}</span>
							</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- buttons -->
  <div id="main-track" class="ps-4">
    <div class="row">
      <div class="col">
        <div class="d-flex align-items-center my-4">
          <a
            href="#"
            id="play"
            class="btn rounded-circle fs-3 d-flex align-items-center justify-content-center"
            ><ion-icon
              name="caret-forward-outline"
              class="text-black"></ion-icon
          ></a>

          <a href="#" class="btn fs-3 text-secondary" id="like"
            ><ion-icon name="heart-outline"></ion-icon
          ></a>
          <a href="#" class="btn fs-3 text-secondary" id="download"
            ><ion-icon name="arrow-down-circle-outline"></ion-icon
          ></a>
          <a href="#" class="btn fs-3 text-secondary" id="options"
            ><ion-icon name="ellipsis-horizontal-outline"></ion-icon
          ></a>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col col-4 ps-4 text-secondary">
        <p># Titolo</p>
      </div>
      <div class="col pe-0 col-5 text-end text-secondary"><p>RIPRODUZIONI</p></div>
      <div class="col  col-3 text-end text-secondary">
        <p class='pe-5 text-secondary'><ion-icon name="time-outline"></ion-icon></p>
      </div>
    </div>
    <hr class="mt-0" />
    <div class="row">
      <div class="col col-7 " id='tracks-name'>
    
      </div>
      <div class="col p-0 col-2 text-end" id='times'>
      </div>
      <div class="col col-3" id='duration'>
      </div>
    </div>
    `;
	albumPosition.appendChild(myDiv);
};

const tracks = (song) => {
	const songPlace = document.getElementById('tracks-name');
	const myOl = document.createElement('ol');
	song.forEach((songs) => {
		const myLi = document.createElement('li');
		myLi.classList.add('py-1');

		myLi.innerHTML = `
		<a href="#" class="btn p-0 border-0 d-flex flex-column tracks-play"
		> <span class='text-start'> ${songs.title} </span>  </a><span class='text-start  text-secondary'> ${songs.artist.name} </span>
    `;

		myOl.appendChild(myLi);
		songPlace.appendChild(myOl);
	});
};

// Ancora da creare la raccolta nello storage
const timesCount = (times) => {
	const countPlace = document.getElementById('times');
	const myUl = document.createElement('ul');
	myUl.classList.add('text-end');
	times.forEach((index) => {
		const myLi = document.createElement('li');
		myLi.classList.add('py-1');
		myLi.innerHTML = `
    <a href="#" class="btn p-0 border-0 d-flex flex-column flex-row-reverse align-items-center"
		><span class='text-secondary'>1</span> <span class='empty'></span> </a>
    `;
		myUl.appendChild(myLi);
		countPlace.appendChild(myUl);
	});
};
const durationS = (song) => {
	const songPlace = document.getElementById('duration');
	const myUl = document.createElement('ul');
	myUl.classList.add('text-end', 'pe-5');
	song.forEach((songs) => {
		const myLi = document.createElement('li');
		myLi.classList.add('py-1');
		myLi.innerHTML = `
		<a href="#" class="btn p-0 border-0 d-flex flex-column flex-row-reverse align-items-center"
		><span class='text-secondary'> ${timingCutted(
			songs.duration
		)}</span> <span class='empty'></span> </a>
    
    `;
		myUl.appendChild(myLi);
		songPlace.appendChild(myUl);
	});
};
// Time
const timingCutted = (duration) => {
	const slots = [];
	duration = Math.ceil(duration);
	while (duration > 59 && slots.length < 2) {
		slots.push((duration % 60).toString().padStart(2, '0'));
		duration = Math.floor(duration / 60);
	}
	if (duration > 0) slots.push(duration);
	return slots.reverse().join(':');
};

const timingComplete = (duration) => {
	const slots = [];
	duration = Math.ceil(duration);

	// Calcolo i secondi
	const seconds = duration % 60;
	if (seconds > 0) {
		slots.push(seconds + 'sec');
	}
	duration = Math.floor(duration / 60);

	// Calcolo i minuti
	const minutes = duration % 60;
	if (minutes > 0) {
		slots.push(minutes + 'min');
	}
	duration = Math.floor(duration / 60);

	// Calcolo le ore
	const hours = duration;
	if (hours > 0) {
		slots.push(hours + 'h');
	}

	return slots.reverse().join(' ');
};
const play = (data) => {
	const likeStorage = [];
	const track = document.querySelectorAll('.tracks-play');
	track.forEach((tracks, index) => {
		tracks.addEventListener('click', (e) => {
			const player = document.querySelector('.player-bar');
			player.classList.remove('d-none');
			e.preventDefault();
			const peppa = data[index];
			playerSongs(peppa.album.cover, peppa.title, peppa.artist.name, peppa.preview);
			const songStorage = peppa.id;
			likeStorage.push(songStorage);
			let stringLikes = JSON.stringify(likeStorage);
			localStorage.setItem('song', stringLikes);
		});
	});
};

const deco = JSON.parse(localStorage.getItem('song'));

const doubleCheck = (storage) => {
	const filterNumbers = storage.filter(
		(item, index) => storage.indexOf(item) === index // se è strettamente uguale mi ristituisce un nuovo array senza i dupplicati
		// se è diverso mi ristituisce array di numeri doppi
	);
	return filterNumbers;
};

console.log(doubleCheck(deco));
// pay botton
const playBtn = () => {
	const playBtn = document.querySelector('#play');

	playBtn.addEventListener('click', (e) => {
		e.preventDefault();

		console.log('ciao');
	});
};

// get
const myUrl = 'https://striveschool-api.herokuapp.com/api/deezer/album/' + albumId;
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
	.then((album) => {
		console.log('API SPOTY', album);
		albums(album);
		console.log(album.tracks.data);
		tracks(album.tracks.data);
		durationS(album.tracks.data);
		timesCount(album.tracks.data);
		play(album.tracks.data);
		playBtn();
	})
	.catch((err) => {
		console.log('Si è verificato un errore:', err);
	});
const start = function () {
	// prendo il riferimento all'immagine del dom
	let imgReference = document.querySelector('#img');

	// creo il context 2d dell'immagine selezionata
	let context = draw(imgReference);

	// creo la mappa dei colori più ricorrenti nell'immagine
	let allColors = getColors(context);

	// trovo colore più ricorrente in esadecimale
	let mostRecurrent = findMostRecurrentColor(allColors);

	// se necessario, aggiunge degli '0' per rendere il risultato un valido colore esadecimale
	let mostRecurrentHex = pad(mostRecurrent);

	// console.log del risultato
	generateBackground(mostRecurrent);
};

const generateBackground = (color) => {
	document.getElementById(
		'center'
	).style.background = `linear-gradient(180deg, #${color} 54%, rgba(0, 0, 0, 0) 100%)`;
};

// PLAYER AUDIO CONTROL

// AUDIO
const playerSongs = (urlCover, urlSongName, urlArtistName, urlSong) => {
	const audio = document.getElementById('audio');

	const playButton = document.getElementById('play-button');
	const pauseButton = document.getElementById('pause-button');
	const nextButton = document.getElementById('next-button');
	const prevButton = document.getElementById('prev-button');

	const albumCover = document.getElementById('albumCover');
	// URL DELLA COVER
	albumCover.src = urlCover;

	// SONG NAME
	const songName = document.getElementById('songName');
	songName.innerText = `${urlSongName}`;
	// ARTIST NAME
	const artistName = document.getElementById('artistName');
	artistName.innerText = `${urlArtistName}`;

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

	let initialVolume; // Inizializzeremo questa variabile all'interno dell'evento click
	let isMuted = false; // Stato iniziale del volume
	const range = document.getElementById('volume-range');
	const volume = document.getElementById('volume');

	// SURCE DELLA CANZONE
	const song = document.getElementById('audio');
	song.src = urlSong;
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
};
