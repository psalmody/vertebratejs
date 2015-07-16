<?php

require('../../mysql-creds.php');

$table = 'vertebrate_test';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT * FROM $table";
    if (isset($_GET['orderBy'])) $sql .= " ORDER BY $_GET[orderBy]";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $sql = "INSERT INTO $table (id,first_name,mi,last_name,age,address,city,state,zip,email) VALUES ";
    $data = json_decode($_POST['data']);
    $appendarr = [];
    switch(gettype($data)) {
        case 'array':
            foreach($data as $d) {
                $list = [];
                foreach($d as $c) {
                    array_push($list,$db->escape_string($c));
                }
                array_push($appendarr, "('".implode("','",$list)."')");
            }
            $sql .= implode(',',$appendarr);
            break;
        case 'object':
            $list = [];
            foreach($data as $d) {
                array_push($list,$db->escape_string($d));
            }
            $sql .= "('".implode("','",$list)."')";
            break;
    };
    $sql .= "ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), mi = VALUES(mi),last_name=VALUES(last_name),age=VALUES(age),address=VALUES(address),city=VALUES(city),state=VALUES(state),zip=VALUES(zip),email=VALUES(email)";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo "saved";
    break;

    case 'PUT':
    $data = json_decode(file_get_contents("php://input"));
    print_r($data);
    break;

    case 'DELETE':
    $data = json_decode(file_get_contents("php://input"));
    readfile("php://input");
    $sql = "DELETE FROM $table WHERE id=$data->id";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}


?>
