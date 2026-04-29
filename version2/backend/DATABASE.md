# Estructura de la base de datos

- **Nombre de la base de datos** : _gastronode_db_
- **Nombre de la tabla de usuarios** : _users_

## Estructura de la tabla **Usuarios**

| Nombre | Tipo                                                                              |
| ------ | --------------------------------------------------------------------------------- |
| Id     | `INT AUTO_INCREMENT PRIMARY KEY` -> Identificador de cada usuario que se registre |
| name   | `VARCHAR(100)` -> Nombre de los usuarios que se registren                         |
| email  | `VARCHAR(100)` -> Correo de los usuarios que se registren                         |

<!-- Para pruebas utilizar el usuario: user_test, la contraseña: test para acceder a la base de datos y demás. -->

## Creación de Base de Datos

Para crear la base de datos y tablas, usando maridb en la terminal usar los siguientes comando:

```bash
sudo mariadb -u root - p
```

    ***para abrir mariadb el comando puede variar de configuracion en configuracion, dependiendo de como este configurado mariadb en su instalacion***

Luego de iniciar sesión en mariadb con las credenciales para hacer modificaciones a las bases de datos, usuarios o tablas. Vamos a ejecutar lo siguiente, todo esto es lenguaje SQL.

```mysql
CREATE DATABASE gastro;

USE gastro;

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100)
);

```

Esto hace lo siguiente: 1. Crear una base de datos con el nombre 'gastronodde_db'. 2. Usamos la base de datos que creamos para posteriormente crear una tabla, sino seleccionamos la base de datos no podremos crear una tabla. 3. Luego creamos la tabla basada en la estructura que definimos de primero.
