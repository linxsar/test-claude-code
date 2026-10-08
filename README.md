# 🎱 Bingo Online

Una página web sencilla para jugar al Bingo desde cualquier dispositivo con conexión a Internet: móvil, tablet u ordenador.

El objetivo es que sea **simple, rápida y 100% responsive**, sin instalaciones ni registros: abres el enlace y juegas.

## ✨ Características

- **Bombo (modo cantador):** saca bolas al azar del 1 al 90, sin repetir, y muestra la última bola y el historial.
- **Panel de números:** tablero con los 90 números donde se marcan los que ya han salido.
- **Cartones (modo jugador):** genera cartones aleatorios de Bingo español (3 filas × 9 columnas, 15 números por cartón).
- **Marcado de números:** toca un número de tu cartón para tacharlo.
- **Comprobación de línea y bingo:** avisa cuando completas una línea o el cartón entero.
- **Modo automático:** saca bolas solo cada 3, 5 u 8 segundos.
- **Voz:** opción para cantar en voz alta cada bola (si el navegador lo permite).
- **Nueva partida:** reinicia el bombo con un solo botón y genera cartones nuevos cuando quieras.
- **Diseño responsive:** se adapta a cualquier tamaño de pantalla (mobile first).

## 🧱 Tecnologías

Proyecto deliberadamente ligero, sin frameworks ni dependencias:

- **HTML5** para la estructura.
- **CSS3** (Flexbox, Grid y media queries) para el diseño responsive.
- **JavaScript (vanilla)** para la lógica del juego.

Al ser un sitio estático, puede publicarse gratis en **GitHub Pages**, Netlify o cualquier hosting estático.

## 📁 Estructura del proyecto

```
.
├── index.html      # Página principal
├── css/
│   └── styles.css  # Estilos y diseño responsive
├── js/
│   ├── bombo.js    # Lógica del bombo (sacar bolas)
│   ├── carton.js   # Generación y marcado de cartones
│   └── main.js     # Inicialización y eventos de la interfaz
├── .nojekyll       # Indica a GitHub Pages que sirva los archivos tal cual
└── README.md
```

Todas las rutas son **relativas** y no hay paso de compilación, así que la carpeta funciona igual en GitHub Pages, en cualquier hosting o abriendo `index.html` en local.

La partida (bolas sacadas, cartones y marcas) se guarda en el navegador con `localStorage`, por lo que no se pierde al recargar la página.

## 🚀 Cómo usarlo

### Jugar en línea

Una vez publicada, basta con abrir la URL de la página en el navegador de cualquier dispositivo.

### Ejecutar en local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/linxsar/test-claude-code.git
   cd test-claude-code
   ```
2. Abre `index.html` directamente en el navegador, o levanta un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
   y visita <http://localhost:8000>.

## 🌐 Publicación

### GitHub Pages

1. Sube el código a la rama `main` del repositorio.
2. En GitHub ve a **Settings → Pages**.
3. En **Source** elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Guarda. En uno o dos minutos la página estará en
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

### Cualquier otro hosting

1. Descarga el repositorio (**Code → Download ZIP**) o clónalo.
2. Sube por FTP o desde el panel del hosting el contenido de la carpeta: `index.html`, `css/` y `js/`.
3. Abre tu dominio en el navegador. No necesita PHP, bases de datos ni Node.js.

También funciona arrastrando la carpeta a Netlify Drop o desplegándola en Vercel o Cloudflare Pages como sitio estático.

## 🎮 Reglas básicas (Bingo de 90 bolas)

1. Cada jugador tiene uno o varios cartones con 15 números repartidos en 3 filas.
2. El cantador saca bolas del bombo una a una y las anuncia.
3. Los jugadores marcan en su cartón los números que van saliendo.
4. **Línea:** el primero en completar una fila entera la canta.
5. **Bingo:** el primero en completar todo el cartón gana la partida.

## 📱 Responsive

La interfaz se diseña con enfoque *mobile first*:

| Dispositivo | Ancho aproximado | Disposición |
|-------------|------------------|-------------|
| Móvil       | < 600 px         | Una columna, botones grandes y táctiles |
| Tablet      | 600 – 1024 px    | Pestañas; bombo y panel de números lado a lado, cartones en rejilla |
| Escritorio  | > 1024 px        | Bombo, panel de números y cartones visibles a la vez |

## 🗺️ Hoja de ruta

- [x] README del proyecto
- [x] Estructura HTML base
- [x] Estilos responsive (móvil, tablet, escritorio y modo oscuro)
- [x] Lógica del bombo (manual y automático)
- [x] Generación de cartones
- [x] Marcado y detección de línea / bingo
- [x] Partida guardada en el navegador
- [x] Lectura en voz alta de las bolas
- [ ] Publicación en GitHub Pages
- [ ] *(Opcional)* Partidas multijugador en tiempo real

## 📄 Licencia

Proyecto de uso libre con fines educativos y de entretenimiento.
