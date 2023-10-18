const addressBarContent = new URLSearchParams(location.search);
// const albumId = addressBarContent.get('albumId');
const albumId = 49383912;
//  922019410110
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

	const myDiv = document.createElement('div');
	myDiv.innerHTML = `
    <div id="album-main">
    <div class="card-album mb-3"">
    <div class="row g-0">
      <div
        class="col-md-4 album-img justify-content-center d-flex shadow-img ms-4">
        <img src="${
				album.cover_big
			}" alt="cover" onload="start()" crossorigin="anonymous" id='img'"/>
      </div>
      <div class="col-md-8 d-flex">
        <div class="card-body d-flex flex-column justify-content-between">
          <div class="flex-grow-1" id="empty-space"></div>
          <p class="card-text fs-6 fw-bolder m-0">${album.record_type}</p>
          <h4 class="card-title fs-1 fw-bold" id="album">${album.title}</h4>
          <div class="flex-grow-1" id="empty-space"></div>
          <div class="d-flex">
            <img
              class="rounded-pill me-2"
              src="${album.artist.picture}"
              width="20"
              height="20"
              alt="aalbum logo" />
            <p class="card-text m-0">
              <small class="text-body-white fw-bold m-0">
                ${album.artist.name} ・${album.release_date}・${album.nb_tracks} Brani,<span
                  class="text-secondary"
                  >${timingComplete(album.duration)}</span
                >
              </small>
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
            class="btn rounded-circle bg-success fs-3 d-flex align-items-center justify-content-center"
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
		<a href="#" class="btn p-0 border-0 d-flex flex-column" id='tracks-play'
		> <span class='text-start'> ${songs.title} </span> <span class='text-start  text-secondary'> ${songs.artist.name} </span> </a>
    `;

		myOl.appendChild(myLi);
		songPlace.appendChild(myOl);
	});
	play();
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

// Event buttons
const play = () => {
	const track = document.querySelectorAll('#tracks-play');
	track.forEach((tracks) => {
		tracks.addEventListener('click', (e) => {
			e.preventDefault();
			let trackName1 = e.target.innerHTML;

			console.log(trackName1);
		});
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
