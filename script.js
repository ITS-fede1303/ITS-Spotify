playlists = []
var playlistAttiva = null;
function aggiungiPlaylist(){
    if(document.querySelector("#menulibreria input").value != ""){
        var playlist = document.querySelector("#menulibreria input").value
        var oggetto = {
            nome: playlist,
            brani: []
        }
        playlists.push(oggetto);
        popolaPlaylists();
        document.querySelector("#menulibreria input").value = "";
    }
}

function popolaPlaylists(){
    var html = ""

    for(var playlist of playlists) {
        html += `<li onclick="apriPlaylist('${playlist.nome}')">${playlist.nome}</li>`
    }

    document.querySelector("#listaPlaylist ol").innerHTML = html
}

function apriPlaylist(playlist) {
    chiudiPlaylist()
    playlistAttiva = playlist
    popolaPlaylist()
    document.querySelector("main").classList.add("show")
    document.getElementById("titoloPlaylist").innerHTML = playlistAttiva;
    document.querySelector('input[name="brano"]').innerHTML = ""
    document.querySelector('input[name="artista"]').innerHTML = ""
}

function chiudiPlaylist() {
    document.querySelector("main").classList.remove("show")
    playlistAttiva = null
}

function aggiungiBrano() {
    if(document.querySelector('input[name="brano"]').value != "" && document.querySelector('input[name="artista"]').value != ""){
        var brano = document.querySelector('input[name="brano"]').value
        var artista = document.querySelector('input[name="artista"]').value
        var oggetto = {
            nome: brano,
            artista: artista
        }
        for(var playlist of playlists) {
            if(playlist.nome == playlistAttiva) {
                playlist.brani.push(oggetto);
            }
        }
    
        popolaPlaylists()
        popolaPlaylist()
        document.querySelector('input[name="brano"]').value = "";
        document.querySelector('input[name="artista"]').value = "";
    }
}

function popolaPlaylist() {
    var html = ""

    var playlistCorrente
    for(var x of playlists) {
        if (x.nome == playlistAttiva) {
            playlistCorrente = x
            break
        }
    }

    for(var brano of playlistCorrente.brani) {
        html += `<li>${brano.nome}<br><p>${brano.artista}</p></li>`
    }

    document.querySelector("#listaBrani ol").innerHTML = html
}
