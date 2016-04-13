<?php
	include_once 'includes/headers.php';

	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';
	//include_once 'includes/functions.php';

	/* Inicializamos la variables para ver si tenemos errores en la base de datos y de que tipo */
	$error_msg = "";

	/* Primero cogemos las opciones de la encriptacion de la contraseña del usuario para ser guardada */
	$saltOk = create_salt();

	$opciones = [
	    'cost' => 11,
	    'salt' => $saltOk,
	];

	/* Recogemos los datos del usuario en formato JSON */
	$objUserRegister = json_decode(file_get_contents('php://input'));

	/* Encriptamos contraseña y borramos datos del JSON para dar seguridad */
	$hash = password_hash($objUserRegister->password, PASSWORD_BCRYPT, $opciones);
	$objUserRegister->password = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 13);

	/* Verificamos si ai un mail o un username igual en la base de datos */
	/*$prep_stmt = "SELECT mail FROM user WHERE mail='".$objUserRegister->mail."' LIMIT 1";
    $stmt = $mysqli->query($prep_stmt);

    if ($stmt->num_rows == 1) {
    	$error_msg = "=mail";
    }*/
    
    /* Verificamos si existe o no este usuario */
	/*$prep_stmt = "SELECT login FROM user WHERE login='".$objUserRegister->username."' LIMIT 1";
    $stmt = $mysqli->query($prep_stmt);
    if ($stmt->num_rows == 1) {
    	$error_msg .= "=username";
    }
    $stmt->close();*/

    /*if($error_msg != ""){
    	echo $error_msg;
    }else{*/
		/* Creamos la consulta */
	    $insert_stmt = "INSERT INTO user (login, mail, password, language, salt) VALUES('".$objUserRegister->username."','".$objUserRegister->mail."','".$hash."','es','".$saltOk."');";
	    $stmt = $mysqli->prepare($insert_stmt);

	    /* Ejecutamos la consulta seleccionada */
	    if(!$stmt->execute()){
	    	echo "fail";
	    }else{
	    	$insertdates_stmt = "INSERT INTO datesUser (id_user, lastName, name) VALUES(".$mysqli->insert_id.",'".$objUserRegister->lastname."','".$objUserRegister->name."');";
	    	$mysqli->query($insertdates_stmt);
	    	echo "success";
	    }
    //}

    $stmt->close();
    /* Cerramos la conexion despues del ultimo acceso a la base de datos */
    $mysqli->close();

	/* Funcion que creara un salt totalmente aleatorio */
	function create_salt() {
		$set_salt = '.,:;-_+*$%&/()=1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		$salt;
		for($i = 0; $i < 64; $i++){
			$salt .= $set_salt[mt_rand(0, 75)];
		}
		return $salt;
	}
?>