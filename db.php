<?php
$host = 'localhost';
$dbname = 'events_db';
$user = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

function getEvents() {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM events");
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $events = array();
    foreach ($rows as $row) {
        $events[$row['year']] = explode(',', $row['event_list']);
    }
    return json_encode($events);
}

function updateEvent($data) {
    global $pdo;
    $year = $data['year'];
    $eventsList = implode(',', $data['events']);

    $stmt = $pdo->prepare("SELECT * FROM events WHERE year = :year");
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $row = $stmt->fetch();

    if ($row) { // Если год существует, обновляем данные
        $stmt = $pdo->prepare("UPDATE events SET event_list = :events_list WHERE year = :year");
        $stmt->bindParam(':events_list', $eventsList);
        $stmt->bindParam(':year', $year);
    } else { // Если года нет, добавляем новые данные
        $stmt = $pdo->prepare("INSERT INTO events (year, event_list) VALUES (:year, :events_list)");
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':events_list', $eventsList);
    }

    $stmt->execute();
    return json_encode(['message' => 'Событие сохранено']);
}

if (isset($_GET['getEvents'])) {
    echo getEvents();
} elseif (isset($_POST['year']) && isset($_POST['events'])) {
    $data = array('year' => $_POST['year'], 'events' => $_POST['events']);
    echo updateEvent($data);
}
?>
