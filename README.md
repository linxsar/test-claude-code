# 🎱 Bingo Online

Un bombo de Bingo online para cantar las bolas desde cualquier dispositivo con conexión a Internet: móvil, tablet u ordenador. Los jugadores usan **cartones físicos** (de papel).

El objetivo es que sea **simple, rápida y 100% responsive**, sin instalaciones ni registros: abres el enlace y juegas.

## ✨ Características

- **Bombo (modo cantador):** saca bolas al azar del 1 al 90, sin repetir, y muestra la última bola y el historial.
- **Panel de números:** tablero con los 90 números donde se marcan los que ya han salido.
- **Modo automático:** saca bolas solo cada 3, 5 u 8 segundos.
- **Voz:** opción para cantar en voz alta cada bola (si el navegador lo permite).
- **Nueva partida:** reinicia el bombo con un solo botón.
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
│   └── main.js     # Inicialización y eventos de la interfaz
├── .nojekyll       # Indica a GitHub Pages que sirva los archivos tal cual
└── README.md
```

Todas las rutas son **relativas** y no hay paso de compilación, así que la carpeta funciona igual en GitHub Pages, en cualquier hosting o abriendo `index.html` en local.

La partida (bolas sacadas) se guarda en el navegador con `localStorage`, por lo que no se pierde al recargar la página.

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

1. Cada jugador tiene uno o varios cartones físicos con 15 números repartidos en 3 filas.
2. El cantador saca bolas del bombo de la web una a una y las anuncia.
3. Los jugadores marcan en su cartón los números que van saliendo.
4. **Línea:** el primero en completar una fila entera la canta.
5. **Bingo:** el primero en completar todo el cartón gana la partida.

## 📱 Responsive

La interfaz se diseña con enfoque *mobile first*:

| Dispositivo | Ancho aproximado | Disposición |
|-------------|------------------|-------------|
| Móvil       | < 600 px         | Una columna: bombo arriba y panel de números debajo |
| Tablet      | 600 – 1024 px    | Bombo y panel de números lado a lado |
| Escritorio  | > 1024 px        | Bombo y panel de números lado a lado, con números más grandes |

## 🗺️ Hoja de ruta

- [x] README del proyecto
- [x] Estructura HTML base
- [x] Estilos responsive (móvil, tablet, escritorio y modo oscuro)
- [x] Lógica del bombo (manual y automático)
- [x] ~~Cartones digitales~~ (retirados: se juega con cartones físicos)
- [x] Partida guardada en el navegador
- [x] Lectura en voz alta de las bolas
- [x] Publicación en GitHub Pages
- [ ] *(Opcional)* Partidas multijugador en tiempo real

## 📄 Licencia

Proyecto de uso libre con fines educativos y de entretenimiento.
