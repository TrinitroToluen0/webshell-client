# webshell-client

This client is designed to send POST requests with PHP commands to web servers that have been compromised. The commands are sent in the `formLastHardwareId2` key, and the server must be vulnerable, executing the commands via an `eval()` function. The tool includes a user interface with various components for ease of use.

## How it works

### Main Components:
1. **URL Input**: An input field where you can specify the URL of the compromised server.
2. **Command Input**: An input field where you can write the PHP command to be executed.
3. **Send Button**: A button that triggers the POST request with the command.
4. **Output Box**: A box where the server's response or command output is displayed.
5. **Predefined Command List**: A list of commonly used commands that can be selected and executed easily.

### Example POST Request:

When the client sends a request, the PHP command is embedded in the `formLastHardwareId2` parameter. Below is an example of how the request is structured:

```bash
formLastHardwareId2=error_reporting(0);@set_time_limit(0);echo"SOWS--";system('tree /F C:/xampp/htdocs/web');echo"--EOWS";
```

- **SOWS** (Start of WebShell): Marks the start of the command's output, making it easier for the client to identify the response.
- **EOWS** (End of WebShell): Marks the end of the output, allowing the client to parse and extract the command's result from within these markers.

In this example, the command `system('tree /F C:/xampp/htdocs/web');` is executed, which lists the directory structure. The server will return the output wrapped between `SOWS--` and `--EOWS`, and the client will then parse this response to display the result.


## Important Disclaimer

This tool is intended for educational and ethical purposes only. It must not be used to exploit systems without proper authorization. Unauthorized access is illegal and unethical. Always ensure you have explicit permission before testing or interacting with any server.
