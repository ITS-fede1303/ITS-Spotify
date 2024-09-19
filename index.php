<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Un'app per la gestione delle playlist musicali.">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <script src="script.js" defer></script>
    <title>Spotify</title>
</head>
<body>
    <nav>
        <section id="buttons">
            <a href="#"><span class="material-symbols-outlined">home</span>Home</a>
            <a href="#"><span class="material-symbols-outlined">search</span>Cerca</a>
        </section>
        <section id="sectionPlaylists">
            <section id="menulibreria">
                <a style="cursor: default;" href="#"><span class="material-symbols-outlined">library_music</span></a>
                <input type="text" class="inputPlaylist" placeholder="Crea playlist" name="playlist">
                <a style="cursor: pointer;" onclick="aggiungiPlaylist()"><span class="material-symbols-outlined">add</span></a>
            </section>
            <section id="listaPlaylist">
                <ol></ol>
            </section>
        </section>
        <div class="player">
            <audio id="audio" src=""></audio>
            <div class="controlloCanzone">
                <button onclick="previousSong()" aria-label="Brano precedente"><span class="material-symbols-outlined">skip_previous</span></button>
                <button id="playPauseButton" onclick="togglePlayPause()" aria-label="Play/Pausa"><span class="material-symbols-outlined" id="playPauseIcon">play_arrow</span></button>
                <button onclick="nextSong()" aria-label="Brano successivo"><span class="material-symbols-outlined">skip_next</span></button>
            </div>
            <div class="controlloTempo">
                <input type="range" id="progressBar" min="0" max="100" value="0" step="1" oninput="seekAudio(event)">
                <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
            </div>
        </div>
    </nav>
    <main>
        <h1 id="titoloPlaylist"></h1>
        <div id="brano">
            <h3>Inserisci brani</h3>
            <div id="barraBrano">
                <input type="text" name="brano" placeholder="Nome Brano">
                <input type="text" name="artista" placeholder="Artista">
                <input type="text" name="durata" placeholder="Durata (MM:SS)">
                <a onclick="aggiungiBrano()" href="#"><span class="material-symbols-outlined">add</span></a>
            </div>
            <div class="line"></div>
        </div>
        <div id="listaBrani">
            <ol></ol>
        </div>
    </main>
</body>
</html>
