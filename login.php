<?php
	include_once 'includes/headers.php';
	
	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';
	include_once 'includes/functions.php';

	/* Recogemos los datos del usuario en formato JSON */
	$objUserLogin = json_decode(file_get_contents('php://input'));

	/* Primero miramos si existe el usuario, sino existe mandamos error, en el caso que exista traemos el pass y el salt para comparar */
	$result = "SELECT id_user, mail, password, salt, account_locked FROM user WHERE login='".$objUserLogin->user."'";
    $stmt = $mysqli->query($result);

    if($stmt->num_rows == 1) {
		// Sacamos los datos y los guardamos en variables
    	foreach ($stmt as $row) {
    		$id_user = $row[id_user];
    		$mail = $row[mail];
    		$password = $row[password];
    		$salt = $row[salt];
    		$bloqueada = $row[account_locked];
    	}

    	// Comprobaremos si la cuenta del usuario esta bloqueada o no
    	if ($bloqueada == 1) {
                // La cuenta está bloqueada.
                // TODO - Envía un correo electrónico al usuario que le informa que su cuenta está bloqueada.
                //return false;
				$json = array( 'success' => "bloqued");
        } else {
		    	// Generamos las opciones de encriptacion y encriptamos para hacer la comparacion del password
				$opciones = [
				    'cost' => 11,
				    'salt' => $salt,
				];    	

				$hash = password_hash($objUserLogin->pass, PASSWORD_BCRYPT, $opciones);
				$objUserLogin->pass = substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 13);

				if(strcmp ($hash , $password ) == 0){
					// Inicio de session con exito
					$json = array( 'success' => "success", 'id' => $id_user, 'mail' => $mail );
				}else{
					// La contraseña no es correcta, se graba este intento en la base de datos.
                    $mysqli->query("INSERT INTO login_attempts(id_user) VALUES (".$id_user.")");

                    // Se mira cuantos intentos llebamos, si llebamos mas de 3 intentos, bloqueamos la cuenta.
				    $prep_query = "SELECT * FROM login_attempts WHERE id_user=".$id_user."";     
			        $stmt = $mysqli->query($prep_query);
			        
			        // Si ha habido más de 3 intentos de inicio de sesión fallidos, bloqueamos la cuenta.
			        if ($stmt->num_rows > 3) {  
				        $mysqli->query("UPDATE user SET account_locked=1 WHERE id_user=".$id_user."");
			        }
					$json = array( 'success' => "failed" );
				}
		}
    }else{
		$json = array( 'success' => "error" );
    }
    // Una vez tenemos rellenado el JSON lo enviamos
    echo json_encode($json, JSON_FORCE_OBJECT);

    // Cerrramos todas las conexiones de la base de datos
    $stmt->close();
    $mysqli->close();

?>