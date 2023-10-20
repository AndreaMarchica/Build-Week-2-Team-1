let songsCardCount = 0;
let songsCardCount2 = 0;

const generatePlaylistsCard = function (arrayOfSongs) {
	const rowPlaylist = document.getElementById('carousel');
	arrayOfSongs.forEach((data) => {
		const fullName = data.artist.name.replace(/ /g, '');
		const newCol = document.createElement('div');
		newCol.classList.add('carousel-item');

		newCol.innerHTML = `	
   
    <!-- qui va la seconda card -->
    <div class="card p-0"  id="viola">
      <div class="row g-0">
        <div class="col-md-3 p-0">
          <img
            src="${data.album.cover_big}"
            alt="..."
            style="max-width: 180px" / class="pt-4 ps-4">
        </div>
        <div class="col-md-8 ps-0">
          <div class="card-body ps-0">
            <h6 class="card-title">ALBUM</h6>
            <h3>${data.album.title}</h3>
            <p>${data.artist.name}</p>
            <p>Ascolta il nuovo singolo di ${data.artist.name}!</p>

            <div class="dropdown">
              <a href='artist.html?artistName=${fullName}' class="btn btn-success btnPlayLogo" style="border-radius: 20px;">
                Play
              </a>
              <button
                type="button"
                class="btn btn-outline-light ms-2" style="border-radius: 20px;">
                Salva
              </button>
              <a
                class="btn"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <ion-icon
                  name="ellipsis-horizontal-outline"></ion-icon>
              </a>

              <ul class="dropdown-menu z-1">
                <li>
                  <a class="dropdown-item" href="#"
                    >File</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#"
                    >Modifica</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#"
                    >Visualizza</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#"
                    >Rirpoduzione</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="#"
                    >Assistenza</a
                  >
                </li>
              </ul>
            </div>
          </div>
        
      </div>
    </div>
  </div>
    `;
		rowPlaylist.appendChild(newCol);
	});
};

const close = () => {
	const close = document.getElementById('close');
	const friends = document.getElementById('friends');
	close.addEventListener('click', (e) => {
		e.preventDefault();
		friends.classList.remove('d-md-block');
	});
};
close();

const buondi = (song) => {
	const buon = document.getElementById('buongiorno');
	song.forEach((element) => {
		const newCol = document.createElement('div');
		newCol.classList.add('col', 'col-md-4');
		if (songsCardCount < 6) {
			newCol.innerHTML = `
  
  <div class="card mb-3" style="max-width: 540px">
    <div class="row g-0">
      <div class="col-md-4">
        <img
          src="${element.album.cover_big}"
          class="img-fluid rounded-start"
          alt="..." / style="width: 80px;height: 80px;">
      </div>
      <div class="col-md-8">
        <div class="card-body ps-0 ms-0 pt-4" >
          <h6 class="card-title" style="font-size: 14px;">${element.album.title}</h6>
        </div>
      </div>
    </div>
 
</div>
  `;

			buon.appendChild(newCol);
		}
		songsCardCount++;
	});
};

const others = (song) => {
	const others = document.getElementById('others');
	song.forEach((element) => {
		const newCol = document.createElement('div');
		newCol.classList.add('col', 'col-md-2');
		if (songsCardCount2 < 5) {
			newCol.innerHTML = `
  
  		<div class="card" style="width:150px;height: 240px;font-size: 12px;" >
									<img
										src="${element.artist.picture}"
										class="card-img-top"
										alt="..." />
									<div class="card-body">
										<h6 class="card-title">${element.artist.name}</h6>
										<p>di Spotify</p>
									</div>
								</div>
  `;

			others.appendChild(newCol);
		}
		songsCardCount2++;
	});
};

const getData = function () {
	const myUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=celentano';
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
			generatePlaylistsCard(song.data);
			others(data);
			// generateGroupCard(song.data);
			// modifyAudioBar(song.data);
			buondi(data);
		})
		.catch((err) => {
			console.log('Si è verificato un errore:', err);
		});
};
getData();

// const generateGroupCard = function (arrayOfSongs) {
// 	const rowGroup = document.getElementById('group-row');
// 	arrayOfSongs.forEach((data) => {
// 		const newCol = document.createElement('div');
// 		// newCol.classList.add("col", "col-6", "col-sm-4", "col-md-3", "col-lg-2");
// 		newCol.innerHTML = `<div class="row">
//         <div class="col-sm-4 mb-3 mt-3 mb-sm-0">
//           <div class="card d-flex flex-row">
//           <img src="${data.artist.picture_medium}" class="card-img-left" alt="...">
//             <div class="card-body d-flex text-center justify-content-center align-items-center">
//               <h5 class="card-title ">Special title treatment</h5>
//             </div>
//           </div>
//         </div>
//         <div class="col-sm-4 mt-3">
//         <div class="card d-flex flex-row">
//         <img src="${data.album.cover_medium}" class="card-img-left" alt="...">
//             <div class="card-body d-flex text-center justify-content-center align-items-center">
//               <h5 class="card-title">Special title treatment</h5>
//             </div>
//           </div>
//         </div>
//         <div class="col-sm-4 mt-3">
//         <div class="card d-flex flex-row">
//         <img src="${data.album.cover_medium}" class="card-img-left" alt="...">
//             <div class="card-body d-flex text-center justify-content-center align-items-center">
//               <h5 class="card-title">Special title treatment</h5>
//             </div>
//           </div>
//         </div>
//       </div>`;
// 		rowGroup.appendChild(newCol);
// 	});
// };

// AUDIO BAR
// const modifyAudioBar = function (arrayOfSongs) {
// 	arrayOfSongs.forEach((data) => {
// 		const trackTitle = document.querySelector('h3');
// 		trackTitle.innerHTML = `<h3>${data.title}</h3>`;
// 		const artist = document.querySelector('div.audio-details > p');
// 		artist.innerHTML = `<p>${data.artist.name}</p>`;
// 		const audioImage = document.querySelector('div.audio-player > img');
// 		audioImage.src = `${data.album.cover_medium}`;
// 		const track = document.querySelector('div.react-player > audio');
// 		track.src = `${data.preview}`;
// 		// const deleteMark = document.querySelector("div.commonninja-ribbon");
// 		// deleteMark.classList.add("d-none !important");
// 	});
// };
