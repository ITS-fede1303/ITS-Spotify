<?php
include 'db.php';

$stmt = $pdo->query("
    SELECT p.nome AS playlist_nome, b.nome AS brano_nome, b.artista, b.durata
    FROM playlists p
    LEFT JOIN playlist_brano pb ON p.id = pb.playlist_id
    LEFT JOIN brani b ON pb.brano_id = b.id
");

$playlists = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $playlistNome = $row['playlist_nome'];

    if (!isset($playlists[$playlistNome])) {
        $playlists[$playlistNome] = ['nome' => $playlistNome, 'brani' => []];
    }

    if ($row['brano_nome']) {
        // Converti la durata da "MM:SS" a secondi
        $durataParts = explode(':', $row['durata']);
        $durataInSecondi = (int)$durataParts[0] * 60 + (int)$durataParts[1];

        $playlists[$playlistNome]['brani'][] = [
            'nome' => $row['brano_nome'],
            'artista' => $row['artista'],
            'durata' => $durataInSecondi
        ];
    }
}

echo json_encode(array_values($playlists));

?>
