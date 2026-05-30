> **Documento historico / desactualizado frente al MVP v1.**
>
> Este archivo conserva el plan inicial de autenticacion. Para el estado vigente del MVP v1, usar `PROJECT_STATE.md` como fuente de verdad. El MVP v1 ya incluye registro publico, recuperacion/restablecimiento de contrasena, email verification no bloqueante, compra guest, activacion post-compra por reset password, Mercado Pago y asignacion automatica de enrollments por webhook `merchant_order`.

---

# AUTH_MVP_PLAN.md

## 1. Objetivo

Definir el alcance inicial de autenticación, panel de alumno y panel de administración para el MVP del proyecto `susana-y-los-hilos-de-la-memoria`.

La meta es implementar un sistema simple, seguro y suficiente para lanzar una primera versión funcional, sin sobrecargar el proyecto con flujos avanzados todavía innecesarios.

---

## 2. Principio general

En esta etapa inicial, la autenticación no estará orientada a registro público libre.

Se prioriza:

- login funcional
- sesiones seguras
- roles básicos
- acceso privado a contenido
- administración mínima de usuarios, cursos y leads

---

## 3. Estrategia de autenticación inicial

### Se implementará

- Auth.js
- login con email + contraseña
- sesiones persistentes
- uso de roles `ADMIN` y `STUDENT`
- contraseñas hasheadas
- protección de rutas privadas

### No se implementará por ahora

- registro público
- recuperación de contraseña
- confirmación de cuenta por email
- OAuth
- magic links
- social login

---

## 4. Cómo existirán los usuarios en el MVP

En esta etapa, los usuarios no crearán su cuenta directamente desde una pantalla pública.

Los usuarios existirán por alguno de estos medios:

- creación manual inicial por seed
- creación manual posterior desde administración o base de datos
- eventual alta manual luego de una venta o contacto

Esto permite simplificar el MVP y enfocarse en acceso, roles y consumo de contenido.

---

## 5. Roles iniciales

### ADMIN

Responsable de gestión interna del sistema.

Capacidades iniciales esperadas:

- acceder al panel admin
- ver leads de contacto
- ver usuarios
- ver cursos
- asignar acceso de cursos a usuarios

### STUDENT

Responsable de consumir cursos asignados.

Capacidades iniciales esperadas:

- iniciar sesión
- acceder a su área privada
- ver cursos disponibles para su cuenta
- entrar al detalle de sus cursos habilitados

---

## 6. Rutas públicas del MVP

- `/`
- `/cursos`
- `/cursos/[slug]`
- `/sobre-mi`
- `/contacto`

---

## 7. Rutas privadas iniciales

### Alumno

- `/mi-cuenta`
- `/mis-cursos`

### Admin

- `/admin`
- `/admin/leads`
- `/admin/usuarios`
- `/admin/cursos`

Estas rutas pueden ajustarse luego, pero representan el alcance mínimo esperado.

---

## 8. Panel de alumno (MVP)

El panel de alumno será mínimo.

### Alcance inicial

- ver información básica de su cuenta
- ver cursos asignados
- entrar a los cursos habilitados

### Fuera de alcance por ahora

- progreso avanzado
- certificados
- notas personales
- favoritos
- historial complejo
- descarga de materiales avanzada

---

## 9. Panel de administración (MVP)

El panel admin será funcional pero pequeño.

### Mínimos indispensables

- ver leads de contacto
- ver usuarios
- ver cursos existentes
- asignar acceso de cursos a usuarios

### No es obligatorio en esta primera versión

- editor avanzado de cursos
- dashboard analítico
- automatizaciones
- gestión compleja de pedidos
- modelado completo de kits
- CMS interno sofisticado

---

## 10. Relación con ventas y accesos

Mientras no exista sistema de pagos, el acceso a cursos podrá resolverse manualmente.

Ejemplo de flujo inicial:

1. usuario consulta o compra por canal externo
2. admin identifica o crea usuario
3. admin asigna acceso al curso
4. usuario inicia sesión y consume el contenido

Esto permite lanzar una versión útil sin depender todavía de pagos automatizados.

---

## 11. Seguridad mínima esperada

- contraseñas hasheadas
- mensajes de error neutros
- cookies seguras
- rutas privadas protegidas
- autorización por rol
- validación de inputs con Zod

---

## 12. Fuera de alcance del MVP de auth

- signup público
- recuperación de contraseña
- OAuth
- email verification
- pagos automáticos
- progreso completo de alumno
- panel admin completo
- asignación automática por compra
- modelado final de kits

---

## 13. Resultado esperado de esta etapa

Al finalizar esta etapa, el sistema debería permitir:

- iniciar sesión
- distinguir entre admin y alumno
- proteger rutas privadas
- mostrar cursos asignados a cada usuario
- permitir administración mínima de accesos

---

## 14. Orden recomendado de implementación

1. Auth.js + sesión + credenciales
2. usuario admin inicial y usuario student de prueba
3. rutas privadas mínimas
4. panel de alumno mínimo
5. panel admin mínimo
6. asignación de cursos a usuarios

---

## 15. Criterio de evolución

Una vez estable este MVP, las siguientes expansiones naturales serán:

- recuperación de contraseña
- registro público o semi-controlado
- pagos
- asignación automática de acceso
- progreso del alumno
- herramientas admin más completas
- modelado y venta de kits
