<?php
	include_once 'includes/headers.php';
	include_once 'includes/register_code.php';
	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';

	/* Recogemos los datos del usuario en formato JSON */
	$objUserVerify = json_decode(file_get_contents('php://input'));

	// Si es el codigo maestro, se registrara un jefe
	if( strcmp (CODE , $objUserVerify->code ) == 0){
			$json = array( 'success' => "success", 
						   'user' => "boss",
						   'boss' => "none"
			);	
	}else{			
			// Sino tendremos que mirar si el codigo pertenece o no a un jefe, en el caso de que pertenezca se podre registrar como empleado de algun jefe
			$result = "SELECT login FROM user WHERE id_role=1 AND code='".$objUserVerify->code."'";
		    $stmt = $mysqli->query($result);

		    if($stmt->num_rows == 1) {
		    	/*foreach ($stmt as $row) {
		    		$name = $row[login];
		    	}*/

				$json = array( 'success' => "success", 
							   'user' => "employe",
							   'boss' => $objUserVerify->code
				);
		    }else{
				$json = array( 'success' => "fail", 
							   'user' => "none",
							   'boss' => "none"
				);	
		    }			
	}

    // Una vez tenemos rellenado el JSON lo enviamos
    echo json_encode($json, JSON_FORCE_OBJECT);
?>