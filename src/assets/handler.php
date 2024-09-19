<?php
require_once "../config.php";
set_time_limit(0);

if (isset($_GET["action"])) {
    $response = [];
    if ($_GET["action"] === "delete") {
        if (!is_writable(__FILE__)) {
            $response["success"] = false;
            $response["message"] = "El archivo no se pudo autodestruir.";
            echo json_encode($response);
            exit;
        }
        unlink(__FILE__);
        $response["success"] = true;
        $response["message"] = "El archivo ha sido autodestruido.";
        echo json_encode($response);
        exit;
    }
}


try {
    if (!isset($_GET["dbname"])) {
        throw new Exception("No se proporcionó el parámetro 'dbname'.");
    }

    $db_name = $_GET["dbname"];
    $mysqli = new mysqli($db_host, $db_usuario, $db_password);

    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    if (!$mysqli->select_db($db_name)) {
        throw new Exception("Error: La base de datos '$db_name' no existe.");
    }

    if (!$mysqli->query('SHOW TABLES')) {
        throw new Exception("Error: No se pudo obtener la lista de tablas.");
    }

    if (empty($result->fetch_all(MYSQLI_NUM))) {
        throw new Exception("Error: No existen tablas en la base de datos.");
    }

    $dump = '';

    foreach ($tables as $table) {
        $table = $table[0];
        $result = $mysqli->query("SHOW CREATE TABLE `$table`");
        $row = $result->fetch_assoc();
        $dump .= $row['Create Table'] . ";\n\n";

        $result = $mysqli->query("SELECT * FROM `$table`");
        $num_fields = $result->field_count;

        while ($row = $result->fetch_row()) {
            $dump .= "INSERT INTO `$table` VALUES(";
            $fields = array();

            for ($j = 0; $j < $num_fields; $j++) {
                $fields[] = "'" . $mysqli->real_escape_string($row[$j]) . "'";
            }

            $dump .= implode(',', $fields);
            $dump .= ");\n";
        }

        $dump .= "\n\n";
    }

    // Establecer las cabeceras para la descarga
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename=database.sql');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . strlen($dump));

    // Enviar el contenido del volcado
    echo $dump;
    exit;
} catch (Exception $e) {
    http_response_code(500);
    $response["message"] = $e->getMessage();
    echo json_encode($response);
    exit;
}
