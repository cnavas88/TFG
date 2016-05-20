<?php
	include_once 'includes/headers.php';
	
	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';
	//include_once 'includes/functions.php';

	/* Recogemos los datos del usuario en formato JSON */
	$objUserChangeUser = json_decode(file_get_contents('php://input'));

	$result = "SELECT salt, password FROM user WHERE login='".$objUserChangeUser->username."'";
    $stmt = $mysqli->query($result);

    if($stmt->num_rows == 1) {
    	foreach ($stmt as $row) {
    		$salt = $row[salt];
    	}

		$opciones = [
		    'cost' => 11,
		    'salt' => $salt,
		];  

		// Encriptamos el password y machacamos la variable original
		$hash = password_hash($objUserChangeUser->pass, PASSWORD_BCRYPT, $opciones);
		$objUserChangeUser->pass = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 13);

		//if(strcmp ($hash , $password ) == 0){
		// Nos guardamos el nuevo password y enviamos el resultado
		$mysqli->query("UPDATE user SET password='".$hash."' WHERE login='".$objUserChangeUser->username."'");
		$json = array( 'success' => "success"); 
		/*}else{
			$json = array( 'success' => "fail"); 
		}*/
    }else{
		$json = array( 'success' => "fail"); 
    }
    // Cerrramos todas las conexiones de la base de datos
    $stmt->close();
    $mysqli->close();

    // Una vez tenemos rellenado el JSON lo enviamos
    echo json_encode($json, JSON_FORCE_OBJECT);
?>