# Álbum FIFA 2026

App web estática para llevar el control personal de un álbum de láminas del Mundial 2026. Está pensada para publicarse en GitHub Pages y usarse desde móviles con datos guardados localmente en el navegador.

## Qué permite hacer

- Ver el progreso general del álbum.
- Marcar láminas como encontradas, repetidas, faltantes o intercambiadas.
- Distinguir si una lámina nueva fue encontrada normalmente o conseguida por intercambio.
- Filtrar láminas faltantes y repetidas por grupo y país/sección.
- Exportar listados PDF de faltantes y repetidas.
- Exportar e importar un respaldo JSON del progreso.
- Revisar un registro local de movimientos confirmados.

## Datos locales

El progreso se guarda en `localStorage` con la clave:

```text
album-fifa-2026-progreso
```

El registro de movimientos se guarda de forma separada con la clave:

```text
album-fifa-2026-movimientos
```

Esto significa que cada navegador o móvil mantiene su propia data. Para mover el avance entre dispositivos, usa las opciones **Exportar data** e **Importar data** dentro de la app.

## Base de láminas

La base de nombres se carga desde:

```text
album-data.txt
```

Si el archivo no se puede cargar en ese momento, la app intenta usar la última base guardada localmente.

## Uso local

Al ser una app estática, puede servirse con cualquier servidor simple. Por ejemplo:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Luego abre:

```text
http://127.0.0.1:4173/
```

## GitHub Pages

El repositorio está preparado para alojarse como sitio estático. No requiere build ni instalación de dependencias para funcionar en GitHub Pages.

## Nota sobre PDF

La exportación PDF carga `jsPDF` desde CDN, por lo que esa función requiere conexión a internet aunque el progreso del álbum se guarde localmente.
