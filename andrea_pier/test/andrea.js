const generatePlaylistsCard = function (arrayOfSongs) {
  const rowPlaylist = document.getElementById("playlist-row");
  arrayOfSongs.forEach((data) => {
    const newCol = document.createElement("div");
    newCol.classList.add("col", "col-6", "col-sm-4", "col-md-3", "col-lg-2");
    newCol.innerHTML = `<div class="card">
    <img src="${data.album.cover_medium}" class="card-img-top" alt="...">
    <div class="card-body">
    <h6 class="card-text">${data.artist.name}</h6>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    </div>
  </div>`;
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
