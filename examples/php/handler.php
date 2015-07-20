<?php

require('../../mysql-creds.php');

$table = 'vertebrate_test';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
    //for get - request sent $_GET['collection'] or $_GET['model']
    $sql = "SELECT * FROM $table";
    if (isset($_GET['collection'])) {
        //if a collection, we'll check for an orderBy attribute
        if (isset($_GET['collection']['orderBy'])) {
            $order = $_GET['collection']['orderBy'];
            $sql .= " ORDER BY $order";
        }
    } else if (isset($_GET['model'])) {
        //if a model, only get one record by id
        $id = $_GET['model']['id'];
        $sql .= " WHERE id = $id ";
    } else {
        echo "collection / model not sent";
        exit;
    }
    //return result as JSON
    $result = $db->query($sql) or die(mysqli_error($db));
    $data = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($data);
    break;

    case 'POST':
    //save with POST
    $sql = "INSERT INTO $table (id,first_name,mi,last_name,age,address,city,state,zip,email) VALUES ";
    if (isset($_POST['model'])) {
        //save one model
        $list = [];
        $data = $_POST['model'];
        foreach($data as $d) {
            array_push($list,$db->escape_string($d));
        }
        $sql .= " ('".implode("','",$list)."') ";
    } else if (isset($_POST['collection'])) {
        //save the whole collection - loop through models
        $models = json_decode($_POST['collection']['models']);
        $appendarr = [];
        foreach($models as $d) {
            //for each model, add each attribute
            //if the model had attributes that the
            //database didn't, this would have to be more manual
            $list = [];
            foreach($d->attributes as $c) {
                array_push($list,$db->escape_string($c));
            }
            array_push($appendarr, "('".implode("','",$list)."')");
        }
        $sql .= implode(', ',$appendarr);
    } else {
        echo "collection / model not sent";
        exit;
    }
    $sql .= " ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), mi = VALUES(mi),last_name=VALUES(last_name),age=VALUES(age),address=VALUES(address),city=VALUES(city),state=VALUES(state),zip=VALUES(zip),email=VALUES(email)";
    //with MySQL "ON DUPLICATE KEY UPDATE" we can handle saving both
    // new models AND updating OLD models
    // otherwise some kind of check for existing would be required
    $res = $db->query($sql) or die(mysqli_error($db));
    echo "saved";
    break;

    case 'DELETE':
    //only models have .delete() methods
    //put all the info from DELETE into $data array
    parse_str(urldecode(file_get_contents("php://input")),$data);
    $id = $data['model']['id'];
    $sql = "DELETE FROM $table WHERE id=$id";
    $res = $db->query($sql) or die(mysqli_error($db));
    echo 'deleted';
    break;
}


?>
