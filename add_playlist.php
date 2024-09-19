<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

file_put_contents('debug.log', print_r($data, true), FILE_APPEND);

if (isset($data['nome'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO playlists (nome) VALUES (:nome)");
        $stmt->execute(['nome' => $data['nome']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        file_put_contents('debug.log', $e->getMessage(), FILE_APPEND);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Nome playlist mancante']);
}
?>
