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
    })
    .catch((err) => {
      console.log("Si è verificato un errore:", err);
    });
};
getData();
