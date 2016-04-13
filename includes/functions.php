<?php 
include_once 'psl-config.php';
 
function login($email, $password, $mysqli) {
    // Usar declaraciones preparadas significa que la inyección de SQL no será posible.
    if ($stmt = $mysqli->prepare("SELECT id_user, login, password, salt FROM user WHERE mail = ? LIMIT 1")) {
        $stmt->bind_param('s', $email);  // Une “$email” al parámetro.
        $stmt->execute();    // Ejecuta la consulta preparada.
        $stmt->store_result();
 
        // Obtiene las variables del resultado.
        $stmt->bind_result($user_id, $username, $db_password, $salt);
        $stmt->fetch();
 
        // Hace el hash de la contraseña con una sal única.
        $password = hash('sha512', $password . $salt);
        if ($stmt->num_rows == 1) {
            // Si el usuario existe, revisa si la cuenta está bloqueada
            // por muchos intentos de conexión.
 
            if (checkbrute($user_id, $mysqli) == true) {
                // La cuenta está bloqueada.
                // Envía un correo electrónico al usuario que le informa que su cuenta está bloqueada.
                return false;
            } else {
                // Revisa que la contraseña en la base de datos coincida 
                // con la contraseña que el usuario envió.
                if ($db_password == $password) {
                    // ¡La contraseña es correcta!
                    // Obtén el agente de usuario del usuario.
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    //  Protección XSS ya que podríamos imprimir este valor.
                    $user_id = preg_replace("/[^0-9]+/", "", $user_id);
                    $_SESSION['user_id'] = $user_id;
                    // Protección XSS ya que podríamos imprimir este valor.
                    $username = preg_replace("/[^a-zA-Z0-9_\-]+/", 
                                                                "", 
                                                                $username);
                    $_SESSION['username'] = $username;
                    $_SESSION['login_string'] = hash('sha512', 
                              $password . $user_browser);
                    // Inicio de sesión exitoso
                    return true;
                } else {
                    // La contraseña no es correcta.
                    // Se graba este intento en la base de datos.
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts(user_id, time)
                                    VALUES ('$user_id', '$now')");
                    return false;
                }
            }
        } else {
            // El usuario no existe.
            return false;
        }
    }
}

function checkbrute($user_id, $mysqli) {
    // Obtiene el timestamp del tiempo actual.
    $now = time();
 
    // Todos los intentos de inicio de sesión se cuentan desde las 2 horas anteriores.
    $valid_attempts = $now - (2 * 60 * 60);
 
    if ($stmt = $mysqli->prepare("SELECT time 
                             FROM login_attempts 
                             WHERE user_id = ? 
                            AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
 
        // Ejecuta la consulta preparada.
        $stmt->execute();
        $stmt->store_result();
 
        // Si ha habido más de 5 intentos de inicio de sesión fallidos.
        if ($stmt->num_rows > 5) {
            return true;
        } else {
            return false;
        }
    }
}