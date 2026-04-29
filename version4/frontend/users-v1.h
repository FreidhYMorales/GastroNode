<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>AdminLTE 2 | Starter</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            name="viewport"
        />
        <link
            rel="stylesheet"
            href="adminlte/bower_components/bootstrap/dist/css/bootstrap.min.css"
        />
        <!-- Font Awesome -->
        <link
            rel="stylesheet"
            href="adminlte/bower_components/font-awesome/css/font-awesome.min.css"
        />
        <!-- Ionicons -->
        <link
            rel="stylesheet"
            href="adminlte/bower_components/Ionicons/css/ionicons.min.css"
        />
        <!-- Theme style -->
        <link rel="stylesheet" href="adminlte/dist/css/AdminLTE.min.css" />
        <!-- AdminLTE Skins. We have chosen the skin-blue for this starter
        page. However, you can choose any other skin. Make sure you
        apply the skin class to the body tag so the changes take effect. -->
        <link
            rel="stylesheet"
            href="adminlte/dist/css/skins/skin-blue.min.css"
        />

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
            <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <!-- Google Font -->
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"
        />
    </head>
    <body class="hold-transition skin-blue sidebar-mini">
        <div class="wrapper">
            <div id="header-container">
                <!-- Main Header -->
            </div>
            <div id="sidebar-container">
                <!-- Left side column. contains the logo and sidebar -->

                <!-- Control Sidebar -->
            </div>
            <div id="content-container">
                <!-- Content Wrapper. Contains page content -->

                <div class="content-wrapper">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First</th>
                                <th scope="col">Last</th>
                                <th scope="col">Handle</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>John</td>
                                <td>Doe</td>
                                <td>@social</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="footer-container">
                <!-- Main Footer -->
            </div>

            <!-- Add the sidebar's background. This div must be placed
  immediately after the control sidebar -->
            <div class="control-sidebar-bg"></div>
        </div>
    </body>
    <script>
        // Funcion para cargar componentes de forma dinámica
        function loadComponents(url, containerId) {
            return fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("error.log" + url);
                    }
                    return response.text();
                })
                .then((data) => {
                    document.getElementById(containerId).innerHTML = data;
                })
                .catch((error) => {
                    console.error("Error fetching" + url, error);
                });
        }

        document.addEventListener("DOMContentLoaded", () => {
            loadComponents("./components/header.html", "header-container");
            loadComponents("./components/sidebar.html", "sidebar-container");
            loadComponents("./components/footer.html", "footer-container");
        });
    </script>
</html>
