const generatePlaylistsCard = function (arrayOfSongs) {
    const rowPlaylist = document.getElementById("playlist-row");
    arrayOfSongs.forEach((data) => {
      const newCol = document.createElement("div");
      newCol.classList.add("col");
      newCol.innerHTML = `	<div class="row ">
      <div class="col ">
        <div class="card" id="viola" >
          <div class="row g-0">
            <div class="col-md-4">
            <img src="..." class="img-fluid  mt-3 ms-3 " alt="..." style="max-width: 180px;">
            </div>
            <div class="col-md-8 ps-0">
            <div class="card-body ps-0">
              <h6 class="card-title">ALBUM</h6>
              <h3></h3>
             <p></p>
             <p>Ascolta il nuovo singolo di </p>
             
             <div class="dropdown">
              <button type="button" class="btn btn-success">Play</button>
             <button type="button" class="btn btn-outline-light">Salva</button>
              <a
                class="btn"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
              </a>

              <ul class="dropdown-menu z-1">
                <li><a class="dropdown-item" href="#">File</a></li>
                <li><a class="dropdown-item" href="#">Modifica</a></li>
                <li><a class="dropdown-item" href="#">Visualizza</a></li>
                <li><a class="dropdown-item" href="#">Rirpoduzione</a></li>
                <li><a class="dropdown-item" href="#">Assistenza</a></li>
              </ul>
            </div>
            </div>
            </div>
          </div>
          </div>
      </div>
    </div>
    `;
      rowPlaylist.appendChild(newCol);
    });
  };
  
  const getData = function () {
    const myUrl =
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=celentano";
    fetch(myUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          if (res.status === 404) {
            throw new Error("404 - Not Found");
          } else if (res.status === 500) {
            throw new Error("500 - Internal Server Error");
          } else {
            throw new Error("Generic ERROR");
          }
        }
      })
      .then((song) => {
        console.log("API SPOTY", song);
        const data = song.data;
        generatePlaylistsCard(song.data);
        generateGroupCard(song.data);
        modifyAudioBar(song.data);
      })
      .catch((err) => {
        console.log("Si è verificato un errore:", err);
      });
  };
  getData();
  
  const generateGroupCard = function (arrayOfSongs) {
    const rowGroup = document.getElementById("group-row");
    arrayOfSongs.forEach((data) => {
      const newCol = document.createElement("div");
      // newCol.classList.add("col", "col-6", "col-sm-4", "col-md-3", "col-lg-2");
      newCol.innerHTML = `<div class="row">
        <div class="col-sm-4 mb-3 mt-3 mb-sm-0">
          <div class="card d-flex flex-row">
          <img src="${data.artist.picture_medium}" class="card-img-left" alt="...">
            <div class="card-body d-flex text-center justify-content-center align-items-center">
              <h5 class="card-title ">Special title treatment</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-3">
        <div class="card d-flex flex-row">
        <img src="${data.album.cover_medium}" class="card-img-left" alt="...">
            <div class="card-body d-flex text-center justify-content-center align-items-center">
              <h5 class="card-title">Special title treatment</h5>
            </div>
          </div>
        </div>
        <div class="col-sm-4 mt-3">
        <div class="card d-flex flex-row">
        <img src="${data.album.cover_medium}" class="card-img-left" alt="...">
            <div class="card-body d-flex text-center justify-content-center align-items-center">
              <h5 class="card-title">Special title treatment</h5>
            </div>
          </div>
        </div>
      </div>`;
      rowGroup.appendChild(newCol);
    });
  };
  
  // AUDIO BAR
  const modifyAudioBar = function (arrayOfSongs) {
    arrayOfSongs.forEach((data) => {
      const trackTitle = document.querySelector("h3");
      trackTitle.innerHTML = `<h3>${data.title}</h3>`;
      const artist = document.querySelector("div.audio-details > p");
      artist.innerHTML = `<p>${data.artist.name}</p>`;
      const audioImage = document.querySelector("div.audio-player > img");
      audioImage.src = `${data.album.cover_medium}`;
      const track = document.querySelector("div.react-player > audio");
      track.src = `${data.preview}`;
      // const deleteMark = document.querySelector("div.commonninja-ribbon");
      // deleteMark.classList.add("d-none !important");
    });
  };
  