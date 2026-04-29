# Módulo 02 — Base de Datos

Archivo: `db.sql`

---

## ¿Qué hace este archivo?

Es el script para crear toda la estructura de la base de datos desde cero.
Se ejecuta una sola vez (o cuando se quiere reiniciar la BD).

```sql
CREATE DATABASE IF NOT EXISTS gastro;
USE gastro;
```

`IF NOT EXISTS` — si la base de datos ya existe, no falla, la ignora.

---

## Las 5 tablas y sus relaciones

```
categorias
    │
    └──< productos          (una categoría tiene muchos productos)
              │
              └──< detalle_pedidos >── pedidos >── usuarios
```

> `>──<` = relación uno a muchos  
> `>──` = llave foránea apunta hacia allá

---

## Tabla: `categorias`

```sql
CREATE TABLE categorias (
    id     INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)  NOT NULL,
    imagen VARCHAR(255)
);
```

| Campo    | Tipo         | Descripción                                         |
| -------- | ------------ | --------------------------------------------------- |
| `id`     | INT          | Identificador único, se incrementa solo             |
| `nombre` | VARCHAR(50)  | Nombre de la categoría (ej: "Bebidas", "Entradas")  |
| `imagen` | VARCHAR(255) | URL o ruta de una imagen (opcional, puede ser NULL) |

**`PRIMARY KEY`** — campo que identifica de forma única cada fila.  
**`AUTO_INCREMENT`** — MySQL asigna el número automáticamente (1, 2, 3...).  
**`NOT NULL`** — ese campo es obligatorio, no puede quedar vacío.

---

## Tabla: `productos`

```sql
CREATE TABLE productos (
    id           INT PRIMARY KEY AUTO_INCREMENT,
    categoria_id INT,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  TEXT,
    precio       DECIMAL(10,2) NOT NULL,
    imagen       VARCHAR(255),
    disponible   BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

| Campo          | Tipo          | Descripción                                             |
| -------------- | ------------- | ------------------------------------------------------- |
| `id`           | INT           | Identificador único                                     |
| `categoria_id` | INT           | A qué categoría pertenece (llave foránea)               |
| `nombre`       | VARCHAR(100)  | Nombre del producto                                     |
| `descripcion`  | TEXT          | Texto largo (sin límite fijo)                           |
| `precio`       | DECIMAL(10,2) | Número con hasta 10 dígitos y 2 decimales. Ej: 12500.50 |
| `imagen`       | VARCHAR(255)  | URL de imagen (opcional)                                |
| `disponible`   | BOOLEAN       | ¿Está disponible? Por defecto: `TRUE`                   |

**`FOREIGN KEY (categoria_id) REFERENCES categorias(id)`**  
→ `categoria_id` debe existir en la tabla `categorias`.
Si pones un ID que no existe, MySQL rechaza el insert.

**`DECIMAL(10,2)`** — mejor que `FLOAT` para precios porque es exacto
(los flotantes tienen errores de redondeo).

---

## Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
    id         INT PRIMARY KEY AUTO_INCREMENT,
    nombre     VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    rol        ENUM('admin', 'cliente', 'repartidor') DEFAULT 'cliente',
    telefono   VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Campo        | Tipo                | Descripción                                           |
| ------------ | ------------------- | ----------------------------------------------------- |
| `id`         | INT                 | Identificador único                                   |
| `nombre`     | VARCHAR(100)        | Nombre completo                                       |
| `email`      | VARCHAR(100) UNIQUE | Correo — no puede repetirse en la tabla               |
| `password`   | VARCHAR(255)        | Contraseña (debería estar hasheada)                   |
| `rol`        | ENUM                | Solo puede ser uno de los 3 valores listados          |
| `telefono`   | VARCHAR(20)         | Opcional                                              |
| `created_at` | TIMESTAMP           | Fecha/hora de creación, MySQL la pone automáticamente |

**`UNIQUE`** — garantiza que no haya dos usuarios con el mismo email.

**`ENUM('admin', 'cliente', 'repartidor')`** — MySQL solo acepta esos
tres valores exactos. Cualquier otro valor causa un error.

**`TIMESTAMP DEFAULT CURRENT_TIMESTAMP`** — MySQL registra el momento
del insert sin que el código tenga que enviar la fecha.

---

## Tabla: `pedidos`

```sql
CREATE TABLE pedidos (
    id                INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id        INT,
    total             DECIMAL(10,2) NOT NULL,
    estado            ENUM('pendiente','confirmado','en_camino','entregado','cancelado') DEFAULT 'pendiente',
    direccion_entrega TEXT NOT NULL,
    fecha             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

| Campo               | Tipo          | Descripción                                     |
| ------------------- | ------------- | ----------------------------------------------- |
| `usuario_id`        | INT           | Quién hizo el pedido (llave foránea → usuarios) |
| `total`             | DECIMAL(10,2) | Precio total del pedido                         |
| `estado`            | ENUM          | Estado actual del pedido                        |
| `direccion_entrega` | TEXT          | Dirección de entrega                            |
| `fecha`             | TIMESTAMP     | Cuándo se hizo el pedido                        |

El `estado` sigue un ciclo de vida:

```
pendiente → confirmado → en_camino → entregado
          ↘ cancelado
```

---

## Tabla: `detalle_pedidos`

```sql
CREATE TABLE detalle_pedidos (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id       INT,
    producto_id     INT,
    cantidad        INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id)   REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);
```

Esta es la tabla **pivote** que une pedidos con productos.
Un pedido puede tener varios productos, y un producto puede aparecer en varios pedidos.

| Columna           | Descripción                                                    |
| ----------------- | -------------------------------------------------------------- |
| `pedido_id`       | A qué pedido pertenece esta línea                              |
| `producto_id`     | Qué producto es                                                |
| `cantidad`        | Cuántas unidades de ese producto                               |
| `precio_unitario` | Precio al momento del pedido (puede diferir del precio actual) |

**¿Por qué guardar `precio_unitario` aquí y no tomarlo de `productos`?**  
Porque si el precio del producto cambia mañana, el pedido de hoy debe
mantener el precio original. Es una buena práctica en sistemas de e-commerce.

---

## Orden de creación y eliminación de tablas

```sql
-- Eliminar en orden inverso a las dependencias
DROP TABLE IF EXISTS detalle_pedidos;  -- depende de pedidos y productos
DROP TABLE IF EXISTS pedidos;          -- depende de usuarios
DROP TABLE IF EXISTS productos;        -- depende de categorias
DROP TABLE IF EXISTS usuarios;         -- independiente
DROP TABLE IF EXISTS categorias;       -- independiente

-- Crear en orden normal
CREATE TABLE categorias ...
CREATE TABLE productos ...             -- necesita que exista categorias
CREATE TABLE usuarios ...
CREATE TABLE pedidos ...               -- necesita que exista usuarios
CREATE TABLE detalle_pedidos ...       -- necesita pedidos y productos
```

Si intentaras borrar `categorias` antes que `productos`, MySQL fallaría
porque `productos` tiene una llave foránea que apunta a `categorias`.
