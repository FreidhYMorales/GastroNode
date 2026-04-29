# Instrucciones para lo del Frontend

Estos son los pasos para hacer el seccionado de la plantilla starter.html, la estructura de carpetas, modificaciones de codigo y demas cosas que vimos en la clase.

## Estructura de carpetas

A continuacion se presenta la estructura de las carpetas que debemos tener y como tienen que estar organizadas para que funcionen las cosas que el inge quiere.

```
GastroNode(Nombre de la carpeta del proyecto)
├── adminlte/
│ ├── bower_components/
│ ├── build/ (este es opcional)
│ ├── dist/
│ ├── plugins/
├── assets/
├── components/ (Aqui van las partes que trociemos de la plantilla)
│ ├── content-wrapper.html
│ ├── control-sidebar.html
│ ├── footer.html
│ ├── header.html
│ ├── scripts.html
│ ├── sidebar.html
│ ├── table.html
├── css/
├── js/
├── node_modules/ (este se crea al instalar boostrap por medio de la terminal)
├── dashboard.html
├── index.html
├── users.html
```

En teoria esa es la estructura de carpetas y arhivos que debemos de tener en la carpeta de nuestro proyecto, alguna cosas como los archivos html que van dentro de la carpeta de components pueden variar dependiendo de la plantilla que nos de, aunque si es la misma que hemos venido usando la estructura debe de ser igual a la anterior.

## Separacion de los components

A continuacion explico en que me baso para separar lo components teniendo encuenta la p`lantilla que nos den, tambien aplica para cualquier plantilla si se entiende bien la logica de como separarlos. Por lo general cada vez que se crea cualquier archivo html, se suelen separa los objetos en grandes grupos por medio de la etiqueta <div></div> o en su defecto por las etiquetas de secciones como <header></header>, <nav></nav>, <footer></footer>, <aside></aside> esto para facilitar los espaciados y separaciones de contenedores asi que en la plantilla debemos de prestar atencion a estas mismas etiquetas:

```
-->
    <body class="hold-transition skin-blue sidebar-mini">
        <div class="wrapper"> <- AQUI HAY UN DIV, ESO QUIERE DECIR QUE ES UN CONTENEDOR
            <!-- Main Header -->
            <header class="main-header">
                <!-- Logo -->
                <a href="index2.html" class="logo">
                    <!-- mini logo for sidebar mini 50x50 pixels -->
                    <span class="logo-mini"><b>A</b>LT</span>
                    <!-- logo for regular state and mobile devices -->
                    <span class="logo-lg"><b>Admin</b>LTE</span>
                </a>

                <!-- Header Navbar -->
                <nav class="navbar navbar-static-top" role="navigation">
                    <!-- Sidebar toggle button-->
                    <a
                        href="#"
                        class="sidebar-toggle"
                        data-toggle="push-menu"
                        role="button"
                    >
                        <span class="sr-only">Toggle navigation</span>
                    </a>
                    <!-- Navbar Right Menu -->
                    <div class="navbar-custom-menu">
                        <ul class="nav navbar-nav">
                            <!-- Messages: style can be found in dropdown.less-->
                            <li class="dropdown messages-menu">
                                <!-- Menu toggle button -->
```
