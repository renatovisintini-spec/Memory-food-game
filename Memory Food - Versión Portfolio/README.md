# Memory Food — Versión Portfolio

Refactorización del proyecto original **Juego de tarjetas de comidas**, conservando intactos los archivos originales.

## Objetivo

Juego de memoria frontend con 16 tarjetas (8 parejas). El jugador debe encontrar todas las parejas con la menor cantidad posible de errores y en el menor tiempo.

## Tecnologías

- HTML5 semántico
- CSS3 (Grid, Flexbox, responsive design y animaciones 3D)
- JavaScript Vanilla (ES Modules)
- DOM y eventos
- LocalStorage

## Funcionalidades

- Registro de jugador
- Login simulado
- Sesión local
- Mostrar/ocultar contraseña
- Validación de formularios sin sobrescribir los valores del usuario
- Tablero generado dinámicamente desde JavaScript
- Mezcla aleatoria de cartas en cada partida
- Animación de giro de tarjetas
- Bloqueo durante la comparación de pareja
- Temporizador único por partida
- Contador de errores
- Contador de parejas encontradas
- Ranking por jugador
- Ranking por ciudad (mejor resultado individual de cada ciudad)
- Cierre de sesión
- Diseño responsive

## Criterio del ranking

1. Menor número de errores.
2. En caso de empate, menor tiempo.

## Nota de seguridad

El registro y el login utilizan `localStorage` y guardan la contraseña en el navegador. Esto se mantiene únicamente como **simulación educativa frontend**. No debe utilizarse como sistema real de autenticación en producción. Una aplicación real debería gestionar usuarios y contraseñas desde un backend seguro, con hashing y sesiones/tokens apropiados.

## Principales mejoras respecto del original

- Eliminación de las 16 funciones repetidas para cada tarjeta.
- Una sola función maneja todos los clics del tablero.
- Corrección del temporizador para evitar múltiples `setInterval()` simultáneos.
- Corrección y simplificación del ranking.
- Orden correcto: menos errores = mejor resultado.
- Sustitución de mensajes de validación escritos dentro de los inputs por mensajes separados.
- Eliminación de código de depuración y variables redundantes.
- CSS reducido a un sistema responsive fluido, sin bloques repetidos por cada resolución.
- Eliminación de dependencias visuales externas e imágenes remotas.
- HTML semántico y accesible.

## Ejecutar el proyecto

Por utilizar módulos ES (`type="module"`), es recomendable abrirlo mediante un servidor local, por ejemplo con Live Server en VS Code.

Archivo inicial: `index.html`.
