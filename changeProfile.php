<?php
	include_once 'includes/headers.php';
	
	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';

	/* Recogemos los datos del usuario en formato JSON */
	$objUserChangeUser = json_decode(file_get_contents('php://input'));

    $id = $objUserChangeUser->id;

	$result = "SELECT lastName, name FROM datesUser WHERE id_user='".$id."'";
    $stmt = $mysqli->query($result);

    if($stmt->num_rows == 1) {
    	foreach ($stmt as $row) {
    		$name = $row[name];
    		$lastName = $row[lastName];
        }
        $result = "SELECT mail FROM user WHERE id_user='".$id."'";
        $stmt = $mysqli->query($result);

        if($stmt->num_rows == 1) {
            foreach ($stmt as $row) {
                $mail = $row[mail];
            }

            // Cogemos los datos que necesitamos, es decir los datos que lleguen vacios los discriminamos y actualizamos segun los datos que nos han puesto
            if($objUserChangeUser->mail != ""){
                $mail = $objUserChangeUser->mail;
            }
            if($objUserChangeUser->name != ""){
                $name = $objUserChangeUser->name;
            }
            if($objUserChangeUser->lastname != ""){
                $lastName = $objUserChangeUser->lastname;
            }

            $sql = "UPDATE user SET mail='".$mail."' WHERE id_user='".$id."'";
            if ($mysqli->query($sql) === TRUE) {
                $json = array( 'success' => "success");
            } else {
                $json = array( 'success' => "fail"); 
            }

            $sql = "UPDATE datesUser SET name='".$name."',lastName='".$lastName."' WHERE id_user='".$id."'";
            if ($mysqli->query($sql) === TRUE) {
                $json = array( 'success' => "success");
            } else {
                $json = array( 'success' => "fail"); 
            }
             
        }else{
            $json = array( 'success' => "fail"); 
        }
    }else{
		$json = array( 'success' => "fail"); 
    }

    // Cerrramos todas las conexiones de la base de datos
    $stmt->close();
    $mysqli->close();

    // Una vez tenemos rellenado el JSON lo enviamos
    echo json_encode($json, JSON_FORCE_OBJECT);
?>