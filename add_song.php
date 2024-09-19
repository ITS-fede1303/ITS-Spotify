<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['playlist']) && isset($data['nome']) && isset($data['artista']) && isset($data['durata'])) {
    try {
        // Ottieni l'ID della playlist
        $stmt = $pdo->prepare("SELECT id FROM playlists WHERE nome = :nome");
        $stmt->execute(['nome' => $data['playlist']]);
        $playlist = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($playlist) {
            $playlistId = $playlist['id'];
            
            // Aggiungi il brano alla tabella brani
            $stmt = $pdo->prepare("INSERT INTO brani (nome, artista, durata) VALUES (:nome, :artista, :durata)");
            $stmt->execute(['nome' => $data['nome'], 'artista' => $data['artista'], 'durata' => $data['durata']]);
            
            // Ottieni l'ID del brano appena inserito
            $branoId = $pdo->lastInsertId();
            
            // Associa il brano alla playlist
            $stmt = $pdo->prepare("INSERT INTO playlist_brano (playlist_id, brano_id) VALUES (:playlist_id, :brano_id)");
            $stmt->execute(['playlist_id' => $playlistId, 'brano_id' => $branoId]);
            
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['error' => 'Playlist non trovata']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Dati mancanti']);
}
?>
