// AUDIO
const audio = document.getElementById('audio')

const playButton = document.getElementById('play-button')
const pauseButton = document.getElementById('pause-button')
const nextButton = document.getElementById('next-button')
const prevButton = document.getElementById('prev-button')

const albumCover = document.getElementById('albumCover')
albumCover.src =
  'https://e-cdns-images.dzcdn.net/images/cover/79234ae9445062515617a1fa06d4be75/120x120-000000-80-0-0.jpg'

const songName = document.getElementById('songName')
songName.innerText = 'Figli Di Papà'

const artistName = document.getElementById('artistName')
artistName.innerText = 'Sfera Ebbasta'

let isPlaying = false

playButton.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play()
    isPlaying = true
    playButton.style.display = 'none'
    pauseButton.style.display = 'block'
  }
})

pauseButton.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause()
    isPlaying = false
    pauseButton.style.display = 'none'
    playButton.style.display = 'block'
  }
})

nextButton.addEventListener('click', () => {
  // Aggiungi la logica per passare alla prossima traccia
})

prevButton.addEventListener('click', () => {
  // Aggiungi la logica per tornare alla traccia precedente
})

audio.addEventListener('ended', () => {
  // Aggiungi la logica per passare automaticamente alla prossima traccia quando una canzone è terminata
})
// PROGRESS

const progress = document.getElementById('progress')
const progressBar = document.getElementById('progress-bar')

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime
  const duration = audio.duration
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = progressPercent + '%'
})

audio.addEventListener('ended', () => {
  playButton.style.display = 'block'
  pauseButton.style.display = 'none'
  audio.currentTime = 0 // Azzera la posizione della canzone
  progress.style.width = '0%' // A
})

progressBar.addEventListener('click', (e) => {
  const progressBarRect = progressBar.getBoundingClientRect()
  const clickX = e.clientX - progressBarRect.left
  const progressBarWidth = progressBarRect.width
  const newTime = (clickX / progressBarWidth) * audio.duration
  audio.currentTime = newTime
})

// VOLUME

let initialVolume // Inizializzeremo questa variabile all'interno dell'evento click
let isMuted = false // Stato iniziale del volume
const range = document.getElementById('volume-range')
const volume = document.getElementById('volume')

const song = document.getElementById('audio')
song.src =
  'https://cdns-preview-a.dzcdn.net/stream/c-a8dedf985bb04afc13c6166ea8a5b86e-6.mp3'

// Aggiungi un evento di ascolto per il cambio del valore del range
range.addEventListener('input', () => {
  // Aggiorna il volume audio con il valore del range
  audio.volume = range.value / 100
  // Aggiorna il valore iniziale quando modifichi il range
  initialVolume = range.value / 100
})

volume.addEventListener('click', () => {
  if (isMuted) {
    // Se è già stato disattivato, ripristina il valore iniziale
    range.value = initialVolume * 100
    audio.volume = initialVolume
    isMuted = false
  } else {
    // Salva il valore corrente come valore iniziale, disattiva il volume
    initialVolume = range.value / 100
    audio.volume = 0
    range.value = 0
    isMuted = true
  }
})
