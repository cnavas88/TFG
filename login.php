<?php
	include_once 'includes/headers.php';
	
	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';

	/* Recogemos los datos del usuario en formato JSON */
	$objUserLogin = json_decode(file_get_contents('php://input'));

	/* Primero miramos si existe el usuario, sino existe mandamos error, en el caso que exista traemos el pass y el salt para comparar */
	$result = "SELECT id_user, mail, password, language, salt, account_locked, id_role, code, level, code_locked FROM user WHERE login='".$objUserLogin->user."'";
    $stmt = $mysqli->query($result);

    if($stmt->num_rows == 1) {
		// Sacamos los datos y los guardamos en variables
    	foreach ($stmt as $row) {
    		$id_user = $row[id_user];
    		$mail = $row[mail];
    		$password = $row[password];
    		$salt = $row[salt];
    		$bloqueada = $row[account_locked];
    		$role = $row[id_role];
    		$code = $row[code];
    		$lan = $row[language];
    		$level = $row[level];
    		$code_locked = $row[code_locked];
    	}


    	// Comprobaremos si la cuenta del usuario esta bloqueada o no
    	if ($bloqueada == 1) {
                // La cuenta está bloqueada.
                // TODO - Envía un correo electrónico al usuario que le informa que su cuenta está bloqueada.
    			// Una vez se haya enviado este correo tendremos que borrar las filas de este usuario en la tabla login_attempts
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
					// Sacamos el resto de datos significativos para enviar a la aplicacion, siempre enviando los minimos
					$result = "SELECT name, picture, total_finish FROM datesUser WHERE id_user='".$id_user."'";
				    $stmt = $mysqli->query($result);
			    	foreach ($stmt as $row) {
			    		$name = $row[name];
			    		$picture = $row[picture];
			    		$total = $row[total_finish];
			    	}
			    	// Obtenemos la imagen del avatar para enviarla al dispositivo
			    	$img = file_get_contents($picture);
			    	$imdata = base64_encode($img);
			    	
			    	// Miramos el code_locked para saber si tenemos que pasar el codigo o no
			    	if( $code_locked ){
			    		$code = 0;
			    	}

					$json = array( 'success' => "success", 
								   'id' => $id_user, 
								   'mail' => $mail, 
								   'picture' => $imdata,
								   'total' => $total,
								   'role' => $role,
								   'code' => $code,
								   'lan' => $lan,
								   'level' => $level
					);		
				}else{
                    // Se mira cuantos intentos llebamos, si llebamos mas de 3 intentos, bloqueamos la cuenta.
				    $prep_query = "SELECT * FROM login_attempts WHERE id_user=".$id_user."";     
			        $stmt = $mysqli->query($prep_query);
			       
			        // Si ha habido más de 3 intentos de inicio de sesión fallidos, bloqueamos la cuenta.
			        if ($stmt->num_rows >= 3) {  
			        	// La contraseña no es correcta, se graba este intento en la base de datos.
                    	//$mysqli->query("INSERT INTO login_attempts(id_user) VALUES (".$id_user.")");
				        $mysqli->query("UPDATE user SET account_locked=1 WHERE id_user=".$id_user."");
			        }else{
			        	// La contraseña no es correcta, se graba este intento en la base de datos.
                    	$mysqli->query("INSERT INTO login_attempts(id_user) VALUES (".$id_user.")");
			        }
					$json = array( 'success' => "failed" );
				}
		}
    }else{
		$json = array( 'success' => "noExists" );
    }
    // Cerrramos todas las conexiones de la base de datos
    $stmt->close();
    $mysqli->close();

    // Una vez tenemos rellenado el JSON lo enviamos
    echo json_encode($json, JSON_FORCE_OBJECT);
?>