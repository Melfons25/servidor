# Integración de Base de Datos: Biblioteca Luz y Saber

## 1. Esquema de Base de Datos

[cite_start]La base de datos del escenario 1 (Biblioteca Luz y Saber) se basa en un **modelo relacional**, el cual es el indicado para garantizar la eficiencia e integridad de los datos[cite: 1, 3].

### Entidades Clave y Relaciones

| Entidad (Tabla) | Propósito Principal | Relación Clave | Justificación |
| :--- | :--- | :--- | :--- |
| **Usuario** | Registra a las personas que solicitan préstamos. | Uno a Muchos con Préstamo. | [cite_start]Un usuario puede tener muchos préstamos activos o históricos[cite: 5]. |
| **Libro** | Registra cada título único de la biblioteca. | Muchos a Muchos con Autor. | [cite_start]Un libro puede tener varios autores; un autor puede escribir varios libros[cite: 5]. |
| **Autor** | Registra los creadores de las obras. | Muchos a Muchos con Libro. | [cite_start]Gestionada por la tabla intermedia `Libro_Autor` para la integridad[cite: 5]. |
| **Préstamo** | La tabla de transacciones. | Muchos a Uno con Usuario y Libro. | [cite_start]Almacena fechas de préstamo y devolución, enlazando un usuario específico a un libro específico[cite: 5]. |

### Visualización del Esquema

Aquí se presenta la visualización del esquema de la base de datos generado en DBeaver:


Aquí se presenta un diagrama ER (Entidad-Relación) realizado en Draw.io para analizar los datos requeridos:


***

## 2. Justificación de Base de Datos Elegida: PostgreSQL

[cite_start]Elegí **PostgreSQL** como el motor de base de datos relacional para este proyecto después de investigar y comparar opciones[cite: 8, 9].

* [cite_start]**Integridad de Datos:** PostgreSQL es transaccional y cumple con las propiedades **ACID**[cite: 10]. [cite_start]Esto es crucial en una biblioteca, donde la consistencia del inventario (saber que un libro está disponible o prestado) no puede fallar[cite: 11].
* [cite_start]**Robustez y Escalabilidad:** Es una base de datos madura, conocida por manejar cargas de trabajo complejas de manera más eficiente que otras bases de datos de código abierto como MySQL[cite: 12].
* [cite_start]**Soporte de Docker:** La base de datos se implementó a través de **Docker** (`postgres:14-alpine`), lo que garantiza que el entorno de desarrollo sea idéntico para cualquier persona o máquina que ejecute el proyecto[cite: 13].

***

## 3. ORM Elegido: Prisma

[cite_start]Elegí **Prisma** como la capa de Mapeo Objeto-Relacional (ORM) para interactuar con PostgreSQL en el servidor Node.js[cite: 14, 15].

* [cite_start]**Seguridad de Tipos:** Prisma genera un **`Prisma Client`** fuertemente tipado[cite: 16]. [cite_start]Esto reduce significativamente los errores de programación al ofrecer autocompletado y detección de errores de esquema en tiempo de desarrollo[cite: 17].
* [cite_start]**Productividad con Migraciones:** Su flujo de trabajo de migración facilita la sincronización de nuestro esquema de JavaScript con la base de datos de PostgreSQL, simplificando la gestión de cambios en el modelo[cite: 18].
* [cite_start]**Diseño Declarativo:** Permite definir todo el esquema de la base de datos en un solo archivo (`schema.prisma`), el cual actúa como la **fuente única de verdad** para la aplicación, mejorando la claridad y el mantenimiento[cite: 19].

***

## 4. Plan de Acción Paso a Paso para la Integración con el Servidor

[cite_start]El siguiente plan resume los pasos cruciales para conectar y validar la comunicación entre el servidor **Express** y la base de datos **PostgreSQL** usando **Prisma**[cite: 20, 21].

| Pasos | Herramienta | Resultado |
| :--- | :--- | :--- |
| **1. Levantamiento de la BD** | `docker run` | [cite_start]El contenedor `biblioteca-db` se levantó con éxito y la BD `bibliotecadb` fue creada[cite: 22]. |
| **2. Creación del Esquema** | `npx prisma migrate dev` | [cite_start]Las tablas `Usuario`, `Libro`, `Prestamo`, etc., se crearon correctamente en PostgreSQL[cite: 22]. |
| **3. Configuración del Servidor** | `index.js` | [cite_start]El servidor Express se pudo iniciar sin errores[cite: 22]. |
| **4. Prueba de Integración** | `POST /usuarios` (con Postman/Insomnia) | [cite_start]Se envió un JSON y se recibió un estado **201 Created**, confirmando que el servidor Express y Prisma guardan datos de forma exitosa en la base de datos[cite: 22]. |
