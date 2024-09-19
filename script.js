let playlists = [];
let playlistAttiva = null;
let currentSongIndex = 0;
let audioContext = null; // AudioContext inizializzato su un'interazione dell'utente
let playbackInterval = null; // Timer per aggiornare la barra di avanzamento
let currentPlaybackTime = 0; // Variabile per tenere traccia del tempo attuale
let isPlaying = false; // Stato di riproduzione

// Carica le playlist al caricamento della pagina
document.addEventListener('DOMContentLoaded', caricaPlaylists);

// Funzione per caricare le playlist dal server
function caricaPlaylists() {
    fetch('playlist.php') // URL per ottenere le playlist
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                playlists = data;
                popolaPlaylists(); // Popola la lista delle playlist
            } else {
                console.error('La risposta del server non è un array:', data);
            }
        })
        .catch(error => console.error('Errore nel recupero delle playlist:', error));
}

// Funzione per aggiungere una nuova playlist
function aggiungiPlaylist() {
    const nomePlaylist = document.querySelector("#menulibreria input").value.trim();

    if (nomePlaylist) {
        fetch('add_playlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nomePlaylist })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Playlist aggiunta con successo.");
                // Ricarica la pagina per riflettere le modifiche
                location.reload();
            } else {
                console.error('Errore nell\'aggiunta della playlist:', data);
                alert("Errore nell'aggiunta della playlist: " + data.error);
            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            alert("Errore nella richiesta. Controlla la console per dettagli.");
        });

        // Pulisci il campo di input
        document.querySelector("#menulibreria input").value = "";
    } else {
        alert("Inserisci il nome della playlist.");
    }
}



// Funzione per popolare la lista delle playlist nella barra laterale
function popolaPlaylists() {
    const html = playlists.map(playlist => 
        `<li onclick="apriPlaylist('${playlist.nome}')">${playlist.nome}</li>`
    ).join('');
    document.querySelector("#listaPlaylist ol").innerHTML = html;
}

// Funzione per aprire una playlist e visualizzarne i brani
function apriPlaylist(nome) {
    playlistAttiva = nome;
    popolaPlaylist();
    document.querySelector("main").classList.add("show");
    document.getElementById("titoloPlaylist").textContent = playlistAttiva;

    // Pulisce i campi input
    document.querySelector('input[name="brano"]').value = "";
    document.querySelector('input[name="artista"]').value = "";
    document.querySelector('input[name="durata"]').value = "";
}

// Funzione per chiudere la playlist attiva
function chiudiPlaylist() {
    document.querySelector("main").classList.remove("show");
    playlistAttiva = null;
}

// Funzione per aggiungere un brano alla playlist attiva
function aggiungiBrano() {
    const nomeBrano = document.querySelector('input[name="brano"]').value.trim();
    const artista = document.querySelector('input[name="artista"]').value.trim();
    const durata = document.querySelector('input[name="durata"]').value.trim(); // Durata in formato MM:SS

    if (nomeBrano && artista && durata) {
        const [minuti, secondi] = durata.split(':').map(Number);
        if (isNaN(minuti) || isNaN(secondi) || secondi >= 60) {
            alert("Formato della durata non valido. Usa il formato MM:SS.");
            return;
        }
        const durataInSecondi = minuti * 60 + secondi;

        // Crea l'oggetto del brano da inviare al server
        const brano = { nome: nomeBrano, artista: artista, durata: durata };

        // Invia i dati al server
        fetch('add_song.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playlist: playlistAttiva,
                nome: nomeBrano,
                artista: artista,
                durata: durata
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("Brano aggiunto con successo.");
                // Ricarica la pagina per riflettere le modifiche
                location.reload();
            } else {
                console.error('Errore nell\'aggiunta del brano:', data);
                alert("Errore nell'aggiunta del brano: " + data.error);
            }
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
            alert("Errore nella richiesta. Controlla la console per dettagli.");
        });

        // Pulisci i campi input
        document.querySelector('input[name="brano"]').value = "";
        document.querySelector('input[name="artista"]').value = "";
        document.querySelector('input[name="durata"]').value = "";
    } else {
        alert("Inserisci il nome del brano, l'artista e la durata.");
    }
}


// Funzione per popolare i brani della playlist attiva
function popolaPlaylist() {
    const listaBraniOl = document.querySelector("#listaBrani ol");
    listaBraniOl.innerHTML = "";

    if (playlistAttiva) {
        const playlist = playlists.find(p => p.nome === playlistAttiva);

        if (playlist && Array.isArray(playlist.brani)) {
            playlist.brani.forEach((brano, index) => {
                const li = document.createElement("li");

                const playButton = document.createElement("button");
                playButton.className = "play-button";
                playButton.onclick = () => playSong(index);
                playButton.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';

                const branoNome = document.createElement("span");
                branoNome.textContent = brano.nome;

                const artistaBrano = document.createElement("p");
                artistaBrano.className = "artistaBrano";
                artistaBrano.textContent = brano.artista;

                const durataBrano = document.createElement("p");
                durataBrano.className = "durataBrano";
                durataBrano.textContent = formatTime(brano.durata);

                li.appendChild(playButton);
                li.appendChild(branoNome);
                li.appendChild(document.createElement("br"));
                li.appendChild(artistaBrano);
                li.appendChild(durataBrano);

                listaBraniOl.appendChild(li);
            });
        } else {
            console.error("La playlist non è valida o non contiene brani.");
        }
    }
}

// Funzione per formattare il tempo in minuti e secondi
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00'; // Gestisce valori non numerici o negativi

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Usa Math.floor per evitare valori decimali
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}


// Inizializza l'AudioContext su un evento di clic
document.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}, { once: true }); // Assicura che l'evento sia gestito solo una volta

// Funzione per avviare la riproduzione di un brano
function playSong(index) {
    const playlist = playlists.find(p => p.nome === playlistAttiva);
    
    if (playlist) {
        const brano = playlist.brani[index];
        const duration = brano.durata; // Durata in secondi

        if (brano && duration > 0) {
            if (audioContext) {
                // Crea un buffer di audio silenzioso della durata del brano
                const source = audioContext.createBufferSource();
                const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
                const channelData = buffer.getChannelData(0);
                channelData.fill(0); // Riempie il buffer con silenzio

                source.buffer = buffer;
                source.connect(audioContext.destination);

                // Se ci sono dati di riproduzione salvati, avvia dal punto giusto
                source.start(0, currentPlaybackTime); // Avvia dal tempo salvato

                // Resetta il timer corrente e imposta la durata
                document.getElementById('playPauseIcon').textContent = 'pause';
                currentSongIndex = index;
                document.getElementById('duration').textContent = formatTime(duration);
                document.getElementById('currentTime').textContent = formatTime(currentPlaybackTime);

                // Ferma il timer precedente, se esistente
                if (playbackInterval) clearInterval(playbackInterval);
                
                // Aggiorna la barra di avanzamento e il contatore
                playbackInterval = setInterval(() => {
                    currentPlaybackTime++;
                    document.getElementById('currentTime').textContent = formatTime(currentPlaybackTime);

                    // Aggiorna la barra di avanzamento
                    const progressBar = document.getElementById('progressBar');
                    progressBar.value = (currentPlaybackTime / duration) * 100;

                    // Stop alla fine della traccia
                    if (currentPlaybackTime >= duration) {
                        clearInterval(playbackInterval);
                        document.getElementById('playPauseIcon').textContent = 'play_arrow';
                        document.getElementById('currentTime').textContent = formatTime(duration);
                    }
                }, 1000);
                
                isPlaying = true; // Indica che l'audio è in riproduzione
            } else {
                console.error("AudioContext non è stato inizializzato.");
            }
        } else {
            alert("Il brano non ha una durata valida.");
        }
    } else {
        alert("Il brano non è stato trovato.");
    }
}

// Funzione per mettere in pausa l'audio
function pauseAudio() {
    if (audioContext) {
        audioContext.suspend(); // Sospende l'AudioContext per mettere in pausa
        clearInterval(playbackInterval); // Ferma il timer
        document.getElementById('playPauseIcon').textContent = 'play_arrow';
        isPlaying = false; // Indica che l'audio è in pausa

        // Salva il tempo di riproduzione corrente
        currentPlaybackTime = parseFloat(document.getElementById('currentTime').textContent.split(':').reduce((acc, time) => (60 * acc) + +time));
    }
}

// Funzione per alternare tra play e pausa
function togglePlayPause() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playSong(currentSongIndex);
    }
}

// Funzione per riprodurre il brano precedente
function previousSong() {
    if (playlistAttiva) {
        currentSongIndex = (currentSongIndex - 1 + playlists.find(p => p.nome === playlistAttiva).brani.length) % playlists.find(p => p.nome === playlistAttiva).brani.length;
        currentPlaybackTime = 0; // Azzerare il tempo di riproduzione
        document.getElementById('progressBar').value = 0; // Azzerare la barra di avanzamento
        playSong(currentSongIndex);
    }
}

// Funzione per riprodurre il brano successivo
function nextSong() {
    if (playlistAttiva) {
        currentSongIndex = (currentSongIndex + 1) % playlists.find(p => p.nome === playlistAttiva).brani.length;
        currentPlaybackTime = 0; // Azzerare il tempo di riproduzione
        document.getElementById('progressBar').value = 0; // Azzerare la barra di avanzamento
        playSong(currentSongIndex);
    }
}

function seekAudio(event) {
    const newValue = event.target.value; // Usa `event.target.value` per ottenere il valore dell'elemento che ha generato l'evento

    const playlist = playlists.find(p => p.nome === playlistAttiva);
    if (playlist) {
        const brano = playlist.brani[currentSongIndex];
        if (brano) {
            const duration = brano.durata;
            const newPlaybackTime = Math.floor((newValue / 100) * duration); // Usa Math.floor per evitare valori decimali

            // Aggiorna la variabile `currentPlaybackTime` e la barra di avanzamento
            currentPlaybackTime = newPlaybackTime;
            document.getElementById('currentTime').textContent = formatTime(currentPlaybackTime);
            document.getElementById('progressBar').value = newValue;

            // Ferma il timer precedente, se esistente
            if (playbackInterval) clearInterval(playbackInterval);

            // Avvia la riproduzione dalla nuova posizione
            playSong(currentSongIndex);
        }
    }
}


// Aggiungi l'evento 'input' alla barra di avanzamento
document.getElementById('progressBar').addEventListener('input', seekAudio);


function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progress = document.querySelector('.progress-bar');
    const percent = (audio.currentTime / audio.duration) * 100; // Calcola il progresso percentuale
    progressBar.value = percent; // Aggiorna il valore dell'input range
    progress.style.width = percent + '%'; // Aggiorna la larghezza della progress-bar
}
