# Recetario de Belli

App web progresiva (PWA) para móvil: crear recetas paso a paso, guardarlas en el propio teléfono, ordenarlas en una estantería de libros por secciones y cocinarlas en «modo cocina», con temporizador para cada paso. Pensada para una persona de 60 años: letra base de 18 px, botones de 63 px o más, vibración al pulsar y doble confirmación antes de borrar.

## Puesta en marcha

```bash
npm install
npm run dev        # abre la app en el móvil desde la misma wifi (http://IP-del-ordenador:5173)
npm run build      # genera la carpeta dist/ lista para publicar
```

Para instalarla en el móvil hay que publicarla en una web con **https** (Netlify, Vercel, GitHub Pages: basta con subir `dist/`). Después, en el móvil:

- **Android (Chrome):** menú ⋮ → «Añadir a pantalla de inicio».
- **iPhone (Safari):** botón Compartir → «Añadir a pantalla de inicio».

Abierta desde el icono funciona sin conexión y las recetas no se borran al cerrar.

## Estructura

```
src/
  config.ts                 Nombre del saludo (Belli) y raciones por defecto
  types.ts                  Tipos: ingrediente, receta, paso, sección
  data/
    ingredients.ts          ~250 ingredientes por categoría y subgrupo (p. ej. 6 tipos de carne picada)
    foodArt.ts              Ilustraciones propias de cada alimento (SVG dibujado en código)
    courses.ts              Secciones del libro de serie
    samples.ts              Recetas de ejemplo (solo para la vista previa)
  lib/
    db.ts                   IndexedDB con copia en memoria si el navegador no deja guardar
    migrate.ts              Pone al día recetas guardadas con versiones anteriores
    courses.ts              Secciones de serie + secciones propias
    timers.ts               Temporizadores con alarma (sonido y vibración)
    units.ts                Unidades, fracciones (½, ¼) y redondeo al escalar raciones
    device.ts               Vibración, compresión de fotos, dictado por voz, pantalla encendida
    share.ts                Ficha de texto para WhatsApp
  components/
    ui.tsx                  Botones grandes, ventanas, confirmación, selectores − / +
    FoodArt.tsx             Muestra la ilustración de un alimento
    IngredientPicker.tsx    Buscador + catálogo por categorías y subgrupos + ingredientes propios
    QuantitySheet.tsx       Cantidad con − / +, barra deslizante y unidades caseras
    StepsEditor.tsx         Pasos con dictado y tiempo de cada paso
    CoursePicker.tsx        Elegir sección o crear una propia
    Shelf.tsx               Estantería: una balda por sección, un libro por receta
    BookReader.tsx          El libro que se abre (y se cierra) con la receta dentro
    TimerBar.tsx            Barra de temporizadores en marcha
    PhotoPicker.tsx         Cámara o galería (la foto se reduce a 1280 px)
    Celebration.tsx         Confeti al guardar
  screens/
    Home.tsx                Saludo, dos botones grandes, buscador y favoritas
    Editor.tsx              Crear o cambiar receta, con autoguardado del borrador
    Book.tsx                Libro de recetas: estantería o lista, filtros, copia de seguridad
    Cook.tsx                Modo cocina: casillas, raciones, temporizadores, compartir
public/
  manifest.webmanifest, sw.js, iconos
```

## Cómo ampliar

- **Más ingredientes:** añade filas en `src/data/ingredients.ts`. Cada fila es `[nombre, dibujo, unidades, extra]`; el dibujo es una clave de `src/data/foodArt.ts`. La primera unidad es la que se propone; `piece: ['diente', 'dientes']` da nombre a las piezas y `fine: true` hace que los gramos vayan de 5 en 5 (especias).
- Desde la propia app, si busca algo que no está, puede añadirlo como «ingrediente nuevo»; queda guardado en «Mis ingredientes».
- **Otro nombre en el saludo:** `src/config.ts`.
- **Letra más grande en toda la app:** sube `font-size` de `html` en `src/styles.css` (todo está en `rem`).

## Orden del libro

- Cada receta va en una sección: 14 de serie (Desayunos, Aperitivos, Ensaladas, Sopas, Legumbres y guisos, Arroces, Pastas, Huevos y tortillas, Verduras, Carnes, Pescados, Panes y masas, Salsas, Postres) y las que ella cree («Cenas rápidas», «Navidad»…). El libro se muestra en ese orden y alfabético dentro de cada sección.
- Favoritas con estrella, que aparecen también en la pantalla de inicio.
- Cada paso puede llevar su tiempo; el total se calcula solo. En el modo cocina, cada paso con tiempo tiene un botón «Avisarme en…» que pone un temporizador con alarma. Los temporizadores siguen contando aunque se cambie de pantalla.
- Notas y trucos de cada receta.
- Ingredientes y pasos se pueden reordenar con «Ordenar».
- Vista de estantería: cada sección es una balda y cada receta un libro (color y altura fijos por receta). Al tocarlo, el libro sale, se pone de frente y se abre la tapa: dentro está ya la receta, y esa misma página crece hasta ocupar la pantalla. Al volver, el libro se cierra y regresa a su balda. Se puede cambiar a vista de lista.
- Copia de seguridad: exporta todas las recetas (con fotos) a un archivo `.json` y las recupera en otro móvil sin duplicar.

## Decisiones técnicas

- Ilustraciones de alimentos dibujadas en SVG dentro del código: no pesan, se ven nítidas a cualquier tamaño y funcionan sin conexión.
- Sin Tailwind ni librerías de componentes: solo React. Una hoja de estilos con variables de color (azul marino, azul petróleo, papel azulado) y tipografías pensadas para leer bien: Atkinson Hyperlegible para el texto y Lexend para títulos, y modo oscuro automático. Menos dependencias significa menos cosas que se rompan al actualizar.
- Datos en IndexedDB (aguanta fotos mejor que localStorage) y `navigator.storage.persist()` para que el navegador no los borre. Si el navegador no permite guardar, aparece un aviso.
- El dictado usa la Web Speech API en español (`es-ES`); si el móvil no la tiene, el botón no se muestra.
- En el modo cocina la pantalla se mantiene encendida (Wake Lock) cuando el móvil lo permite.
- Compartir usa el menú del sistema en el móvil (donde aparece WhatsApp) y, si no existe, un enlace `wa.me`.
