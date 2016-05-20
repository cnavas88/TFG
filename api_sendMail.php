<?php 
	$mail = new PHPMailer();
	//indico a la clase que use SMTP
	$mail­>IsSMTP();
	//permite modo debug para ver mensajes de las cosas que van ocurriendo
	$mail­>SMTPDebug = 2;
	//Debo de hacer autenticación SMTP
	$mail­>SMTPAuth = true;
	$mail­>SMTPSecure = "ssl";
	//indico el servidor de Gmail para SMTP
	$mail­>Host = "smtp.gmail.com";
	//indico el puerto que usa Gmail
	$mail­>Port = 465;
	//indico un usuario / clave de un usuario de gmail
	$mail­>Username = "dante.maniacs@gmail.com";
	$mail­>Password = "Life_gorroneapunk1234";
	$mail­>SetFrom('tu_correo_electronico_gmail@gmail.com', 'Nombre completo');
	$mail­>AddReplyTo("tu_correo_electronico_gmail@gmail.com","Nombre completo");
	$mail­>Subject = "Envío de email usando SMTP de Gmail";
	$mail­>MsgHTML("Hola que tal, esto es el cuerpo del mensaje!");
	//indico destinatario
	$address = "dante.maniacs@gmail.com";
	$mail­>AddAddress($address, "Nombre completo");
	if(!$mail­>Send()) {
	echo "Error al enviar: " . $mail­>ErrorInfo;
	} else {
	echo "Mensaje enviado!";
	} 

	/*try {
		// Crear una nueva  instancia de PHPMailer habilitando el tratamiento de excepciones
		$mail = new PHPMailer(true); 
		 
		// Configuramos el protocolo SMTP con autenticación
		$mail->IsSMTP();
		$mail->SMTPAuth = true;
		 
		// Configuración del servidor SMTP
		$mail->Port = 25
		$mail->Host = 'miservidor.smpt.com';
		$mail->Username   = "ejemplo@developando.com"
		$mail->Password = "XXXXXXX"
		 
		// Configuración cabeceras del mensaje
		$mail->From = "remite@developando.com";
		$mail->FromName = "Mi nombre y apellidos";
		 
		$mail->AddAddress("dante.maniacs@gmail.com","Nombre 1");
		 
		$mail->AddCC("copia1@correo.com","Nombre copia 1");
		 
		$mail->AddBCC(“copia1@correo.com”,”Nombre copia 1″);
		 
		$mail->Subject = "Asunto del correo";
		 
		// Creamos en una variable el cuerpo, contenido HMTL, del correo
		$body  = "Proebando los correos con un tutorial<br>";
		$body .= "hecho por <strong>Developando</strong>.<br>";
		$body .= "<font color='red'>Visitanos pronto</font>";
		 
		$mail->Body = $body;
		 
		// Ficheros adjuntos
		/*$mail->AddAttachment("misImagenes/foto1.jpg", "developandoFoto.jpg");
		$mail->AddAttachment("files/proyecto.zip", "demo-proyecto.zip");*/
		 
		// Enviar el correo
		//$mail->Send(); 

/*
	$destinatario = "dante.maniacs@gmail.com"; 
	$asunto = "Este mensaje es de prueba"; 
	$cuerpo = ' 
	<html> 
	<head> 
	   <title>Prueba de correo</title> 
	</head> 
	<body> 
	<h1>Hola amigos!</h1> 
	<p> 
	<b>Bienvenidos a mi correo electrónico de prueba</b>. Estoy encantado de tener tantos lectores. Este cuerpo del mensaje es del artículo de envío de mails por PHP. Habría que cambiarlo para poner tu propio cuerpo. Por cierto, cambia también las cabeceras del mensaje. 
	</p> 
	</body> 
	</html> 
	'; 

	//para el envío en formato HTML 
	$headers = "MIME-Version: 1.0\r\n"; 
	$headers .= "Content-type: text/html; charset=iso-8859-1\r\n"; 

	//dirección del remitente 
	$headers .= "From: Carlos Navas Buzon <dante.maniacs@gmail.com>\r\n"; 

	//dirección de respuesta, si queremos que sea distinta que la del remitente 
	$headers .= "Reply-To: dante.maniacs@gmail.com\r\n"; 

	//ruta del mensaje desde origen a destino 
	$headers .= "Return-path: dante.maniacs@gmail.com\r\n"; 

	//direcciones que recibián copia 
	$headers .= "Cc: dante.maniacs@gmail.com\r\n"; 

	//direcciones que recibirán copia oculta 
	$headers .= "Bcc: pepe@pepe.com,juan@juan.com\r\n"; 

	$accept = mail($destinatario,$asunto,$cuerpo,$hea); 

	if($accept){
		echo "EMAIL ENVIADO";
	}else{
		echo "ERROR";
	}*/
?>
 

