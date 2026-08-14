# Kumitex

Landing page de **Kumitex** — infraestructura digital para torneos de karate: inscripciones, categorías, llaves, tatamis, resultados en vivo y clasificación final desde una sola plataforma.

## Estructura

- `index.html` — la landing completa (Tailwind CDN + JS vanilla)
- `assets/` — imágenes de la página
- `Logo.png`, `Torneo.png`, `LLaves.png`, `ejemplo.png` — imágenes referenciadas por la landing

## Formulario de demo

Las solicitudes del formulario "Solicitar una demo" se guardan en Supabase (tabla `kumitex_demo_requests`, proyecto `plataforma`). La clave usada en el frontend es la *publishable key* (pública por diseño); la lectura de la tabla está bloqueada por RLS, así que los leads solo se ven desde el [dashboard de Supabase](https://supabase.com/dashboard/project/rldtkomtclolhbmrphgh/editor).

## Desarrollo

Es un sitio estático: basta abrir `index.html` en el navegador o servirlo con cualquier servidor estático.
