/* ----- Global Variables ----- */
var terminal = document.querySelector("#terminal-output");
var php_code = ``;
var php_procedural_code = ``;
var php_oop_code = ``;
var php_pdo_code = ``;
var error_code = ``;

/* ----- Code Merger ----- */
const codeMerger = (proc,oops,pdo) => {
    php_code = `${proc.replace("?>","")}${oops.replace("<?php","").replace("?>","")}${pdo.replace("<?php","")}`;
    return php_code;
}

/* ----- Typing Animation ----- */
const output_typer = (code) => {
    terminal.innerHTML = null;
    const disabled_btn = document.querySelectorAll(".disabled-sometimes");
    const str = code;
    const chars = str.split("");
    const interval = setInterval(() => {
        if (!chars.length) {
            for( let i = 0; i < disabled_btn.length; i++ ){disabled_btn[i].removeAttribute("disabled", "");}
            return clearInterval(interval);
        }
        for( let i = 0; i < disabled_btn.length; i++ ){disabled_btn[i].setAttribute("disabled", "");}
        terminal.scrollTop = terminal.scrollHeight;
        terminal.innerHTML += chars.shift();
    }, 5);
}

/* ----- Blank Space Detector ----- */
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

/* ----- Gives The Value To The Terminal ----- */
function valueGiver(whichCode) {
    if (whichCode == "connection") {

        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php
        
    /* ----- Procedural Code ----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";

    $connect = mysqli_connect($server,$usr,$pwd);

    mysqli_select_db($connect,"${database_name}");
    
    if (!$connect) {
        die("Connection failed: " . mysqli_connect_error());
    }
    echo "Connected successfully";
        
?>`;
        php_oop_code = `<?php 
    
    /* ----- Object-Oriented Code ----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";

    $connect = new mysqli($server, $usr, $pwd);

    mysqli_select_db($connect,"${database_name}");

    if (mysqli_connect_error()) {
        die("Database connection failed: " . mysqli_connect_error());
    }
    echo "Connected successfully";

?>`;
        php_pdo_code = `<?php

    /* ----- PDO Code ----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";

    try {

        $conn = new PDO("mysql:host=$server;dbname=${database_name}", $usr, $pwd);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Connected successfully";

    }catch(PDOException $e){
        echo "Connection failed: " . $e->getMessage();
    }

?>`;
        php_code = `${php_procedural_code.replace("?>","")}${php_oop_code.replace("<?php","").replace("?>","")}${php_pdo_code.replace("<?php","")}`;

        output_typer(php_code);

        document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
        document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
        document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }

    if (whichCode == "create") {
        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php
            
    /* ----- Procedural Code ----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";

    $connect = mysqli_connect($server,$usr,$pwd);
    
    if (!$connect) {
        die("Connection failed: " . mysqli_connect_error());
    }
    echo "Connected successfully";
        
    $sql = "CREATE DATABASE ${database_name}";

    if (mysqli_query($connect, $sql)) {
        echo "Database created successfully";
    }
    else {
        echo "Error creating database: " . mysqli_error($connect);
    }

    mysqli_close($connect);
?> `;
        php_oop_code = `<?php
    /* ----- Object-Oriented Code----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";
    
    $connect = mysqli_connect($server,$usr,$pwd);

    if ($connect->connect_error) {
        die("Connection failed: " . $connect->connect_error);
    }
    
    $sql = "CREATE DATABASE ${database_name}";

    if ($connect->query($sql) === TRUE) {
        echo "Database created successfully";
    } else {
        echo "Error creating database: " . $connect->error;
    }
    
    $connect->close();
?> `;
        php_pdo_code = `<?php

    /* ----- PDO Code ----- */

    $server = "${server_name}";
    $usr = "${user_name}";
    $pwd = "${password}";
    
    try {

      $conn = new PDO("mysql:host=$server", $usr, $pwd);
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $sql = "CREATE DATABASE ${database_name}";
      $conn->exec($sql);
      echo "Database created successfully<br>";
      
    } catch(PDOException $e) {
      echo $sql . "<br>" . $e->getMessage();
    }
    
    $conn = null; 
?>`;
    output_typer(codeMerger(php_procedural_code,php_oop_code,php_pdo_code));

    document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
    document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
    document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }

    if (whichCode == "select") {
        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;
        let table_name = document.querySelector("#tablename").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(table_name)){error_code = `Error : Table-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php

    /* ----- Procedural-Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM ${table_name}";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {

        while($row = mysqli_fetch_assoc($result)) {
        echo "id: ".$row["id"]." - Name: ".$row["firstname"]. " " .$row["lastname"]."<br>";
        }
    } else {
        echo "0 results";
    }

    mysqli_close($conn);
?> `;
        php_oop_code = `<?php

    /* ----- Object-Oriented Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";
    
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $sql = "SELECT * FROM ${table_name}";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {

      while($row = $result->fetch_assoc()) {
          echo "id: ".$row["id"]." - Name: ".$row["firstname"]." ".$row["lastname"]."<br>";
      }
    } else {
        echo "0 results";
    }

    $conn->close();
?>`;
        php_pdo_code = `<?php

    /* ----- PDO-Code ----- */
    
    echo "<table style='border: solid 1px black;'>";
    echo "<tr><th>Id</th><th>Firstname</th><th>Lastname</th></tr>";
    
    class TableRows extends RecursiveIteratorIterator {
      function __construct($it) {
        parent::__construct($it, self::LEAVES_ONLY);
      }
  
      function current() {
        return "<td style='width:150px;border:1px solid black;'>" . parent::current(). "</td>";
      }
  
      function beginChildren() {
        echo "<tr>";
      }
  
      function endChildren() {
        echo "</tr>" . "\\n";
      }
    }
    
    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $conn->prepare("SELECT * FROM ${table_name}");
        $stmt->execute();
    
        $result = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        foreach(new TableRows(new RecursiveArrayIterator($stmt->fetchAll())) as $k=>$v) {
            echo $v;
        }
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
    $conn = null;
    echo "</table>";
?>`;

        php_code = `${php_procedural_code.replace("?>","")}${php_oop_code.replace("<?php","").replace("?>","")}${php_pdo_code.replace("<?php","")}`;
        output_typer(php_code);

        document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
        document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
        document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }

    if (whichCode == "update") {
        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;
        let table_name = document.querySelector("#tablename").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(table_name)){error_code = `Error : Table-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php

    /* ----- Procedural-Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "UPDATE ${table_name} SET lastname='Any' WHERE id=2";

    if (mysqli_query($conn, $sql)) {
        echo "Record updated successfully";
    } 
    else {
        echo "Error updating record: " . mysqli_error($conn);
    }

    mysqli_close($conn);
?> `;
        php_oop_code = `<?php

    /* ----- Object-Oriented Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";
    
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
      
    $sql = "UPDATE ${table_name} SET lastname='Any' WHERE id=2";
      
    if ($conn->query($sql) === TRUE) {
        echo "Record updated successfully";
    }
    else {
        echo "Error updating record: " . $conn->error;
    }

    $conn->close();
?>`;
        php_pdo_code = `<?php

    /* ----- PDO-Code ----- */
    
    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    try {

        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
        $sql = "UPDATE ${table_name} SET lastname='Any' WHERE id=2";
      
        $stmt = $conn->prepare($sql);

        $stmt->execute();

        echo $stmt->rowCount() . " records UPDATED successfully";
    }

    catch(PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }

    $conn = null;
?>`;

        php_code = `${php_procedural_code.replace("?>","")}${php_oop_code.replace("<?php","").replace("?>","")}${php_pdo_code.replace("<?php","")}`;
        output_typer(php_code);

        document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
        document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
        document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }

    if (whichCode == "delete") {
        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;
        let table_name = document.querySelector("#tablename").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(table_name)){error_code = `Error : Table-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php

    /* ----- Procedural-Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "DELETE FROM ${table_name} WHERE id=3";

    if (mysqli_query($conn, $sql)) {
        echo "Record deleted successfully";
    } 
    else {
        echo "Error deleting record: " . mysqli_error($conn);
    }

    mysqli_close($conn);
?>`;
        php_oop_code = `<?php

    /* ----- Object-Oriented Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";
    
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "DELETE FROM ${table_name} WHERE id=3";

    if ($conn->query($sql) === TRUE) {
        echo "Record deleted successfully";
    }
    else {
        echo "Error deleting record: " . $conn->error;
    }

    $conn->close();
?>`;
        php_pdo_code = `<?php

    /* ----- PDO-Code ----- */
    
    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
        $sql = "DELETE FROM ${table_name} WHERE id=3";

        $conn->exec($sql);
        echo "Record deleted successfully";
    } 
    catch(PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }

    $conn = null;
?>`;

        php_code = `${php_procedural_code.replace("?>","")}${php_oop_code.replace("<?php","").replace("?>","")}${php_pdo_code.replace("<?php","")}`;
        output_typer(php_code);

        document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
        document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
        document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }

    if (whichCode == "insert") {
        let server_name = document.querySelector("#servername").value;
        let user_name = document.querySelector("#user").value;
        let password = document.querySelector("#password").value;
        let database_name = document.querySelector("#database").value;
        let table_name = document.querySelector("#tablename").value;

        if(isEmptyOrSpaces(server_name)){ error_code = `Error : Server-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(user_name)){error_code = `Error : User-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(database_name)){error_code = `Error : Database-Name : Not Found`;output_typer(error_code);return false;}
        if(isEmptyOrSpaces(table_name)){error_code = `Error : Table-Name : Not Found`;output_typer(error_code);return false;}

        php_procedural_code = `<?php

    /* ----- Procedural-Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    $conn = mysqli_connect($servername, $username, $password, $dbname);

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "INSERT INTO ${table_name} (firstname, lastname, email) VALUES ('name', 'lastname', 'name@gmail.com')";

    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
    }
    else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    mysqli_close($conn);
?>`;
        php_oop_code = `<?php

    /* ----- Object-Oriented Code ----- */

    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";
    
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO ${table_name} (firstname, lastname, email) VALUES ('name', 'lastname', 'name@gmail.com')";

    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    }
    else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
?>`;
        php_pdo_code = `<?php

    /* ----- PDO-Code ----- */
    
    $servername = "${server_name}";
    $username = "${user_name}";
    $password = "${password}";
    $dbname = "${database_name}";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "INSERT INTO ${table_name} (firstname, lastname, email) VALUES ('name', 'lastname', 'name@gmail.com')";
        $conn->exec($sql);
        
        echo "New record created successfully";
    }
    catch(PDOException $e) {
        echo $sql . "<br>" . $e->getMessage();
    }

    $conn = null;
?>`;

        php_code = `${php_procedural_code.replace("?>","")}${php_oop_code.replace("<?php","").replace("?>","")}${php_pdo_code.replace("<?php","")}`;
        output_typer(php_code);

        document.getElementById("procedural").addEventListener("click",() => {terminal.innerHTML = php_procedural_code;});
        document.getElementById("oops").addEventListener("click",() => {terminal.innerHTML = php_oop_code;});
        document.getElementById("pdo").addEventListener("click",() => {terminal.innerHTML = php_pdo_code;});
    }
}

/* ----- Removing The Tab Key Default Action -----  */
var textareas = document.getElementsByTagName('textarea');
var count = textareas.length;
for (var i = 0; i < count; i++) {
    textareas[i].onkeydown = function (e) {
        if (e.keyCode == 9 || e.which == 9) {
            e.preventDefault();
            var s = this.selectionStart;
            this.value = this.value.substring(0, this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
            this.selectionEnd = s + 1;
        }
    }
}

/* ---------- Unescape To Escape ---------- */
function convert(escapedHTML) {return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');}

/* ----------  Copy-btn  ---------- */
let copyBtn = document.querySelector(".btn-copy");
copyBtn.addEventListener("click", () => {navigator.clipboard.writeText(convert(document.querySelector("#terminal-output").innerHTML));});

/* ----- AJAX - Form ----- */
function codeLoader(whichCode) {
    document.getElementById("form-container").classList.remove("d-none");
    var xhttp = new XMLHttpRequest();
    if (whichCode == "connect_code"){xhttp.open("GET", "../pages/connect.html", true);}
    if (whichCode == "create_code") {xhttp.open("GET", "../pages/create.html", true);}
    if (whichCode == "select_code") {xhttp.open("GET", "../pages/display.html", true);}
    if (whichCode == "update_code") {xhttp.open("GET", "../pages/update.html", true);}
    if (whichCode == "delete_code") {xhttp.open("GET", "../pages/delete.html", true);}
    if (whichCode == "insert_code") {xhttp.open("GET", "../pages/insert.html", true);}
    xhttp.onreadystatechange = function () {if (this.readyState == 4 && this.status == 200) {document.getElementById("form-container").innerHTML = this.responseText;}};
    xhttp.send();
}