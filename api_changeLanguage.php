<?php
	include_once 'includes/headers.php';

	/* incluimos archivos de configuracion de la base de datos */
	include_once 'includes/db_connect.php';

	$objUserLanguage = json_decode(file_get_contents('php://input'));

    $newlanguage = $objUserLanguage->newlanguage;
    $id_user = $objUserLanguage->id;

    // Actualizamos el campo
    $sql = "UPDATE user SET language='".$newlanguage."' WHERE id_user=".$id_user."";

    if ($mysqli->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "fail";
    }

    $mysqli->close();
?>