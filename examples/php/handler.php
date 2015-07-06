<?php

require('../../mysql-creds.php');

$table = 'vertebrate_test';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    $sql = "SELECT * FROM $table";
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    $sql = "INSERT INTO $table (first_name,mi,last_name,age,address,city,state,zip,email) VALUES ";
    print_r(json_decode($_POST['data']));
    //$res = $db->query($sql) or die(mysqli_error($db));
    //echo "saved";
    break;

    case 'DELETE':
    $data = json_decode(file_get_contents("php://input"));
    print_r($data);
    //$sql = '';
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}


?>
