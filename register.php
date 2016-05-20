<?php
	include_once 'includes/headers.php';

	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';
	//include_once 'includes/functions.php';

	/* Inicializamos la variables para ver si tenemos errores en la base de datos y de que tipo */
	$error_msg = "";
	/* Iniciamos la variable de role */
	$role;

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
	$code;

	if( strcmp ($objUserRegister->code , "boss" ) == 0 ){
		// Le damos al jefe un codigo totalmente aleatorio para que se lo de a los usuarios normales para que se registren como sus empleados
		$set_code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		for($i = 0; $i < 5; $i++){ $code .= $set_code[mt_rand(0, 51)]; }
		$role = 1;
	}else{
		// REGISTRO DE USUARIO NORMAL
		$code = $objUserRegister->bossCode;
		$role = 2;
	}

	/* Creamos la consulta */
    $insert_stmt = "INSERT INTO user (login, mail, password, language, salt, id_role, code) VALUES('".$objUserRegister->username."','".$objUserRegister->mail."','".$hash."','es','".$saltOk."',".$role.",'".$code."');";
    $stmt = $mysqli->prepare($insert_stmt);

    /* Ejecutamos la consulta seleccionada */
    if(!$stmt->execute()){
    	echo "fail";
    }else{
    	$insertdates_stmt = "INSERT INTO datesUser (id_user, lastName, name) VALUES(".$mysqli->insert_id.",'".$objUserRegister->lastname."','".$objUserRegister->name."');";
    	$mysqli->query($insertdates_stmt);
    	echo "success";
    }

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