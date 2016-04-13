<?php
	include_once 'includes/headers.php';

	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';

	$username = $_GET["username"];

    /* Verificamos si existe o no este usuario */
	$prep_stmt = "SELECT login FROM user WHERE login='".$username."' LIMIT 1";
    $stmt = $mysqli->query($prep_stmt);

 	if ($stmt->num_rows == 1) {
    	echo "fail";
    }else{
    	echo "success";
    }

    $stmt->close();
    $mysqli->close();
?>