/**
 * Interfaz: conecta el bombo con el HTML.
 */
(function (global) {
  'use strict';

  const { Bombo } = global.Bingo;
  const doc = global.document;
  const $ = (id) => doc.getElementById(id);

  /* ---------- Almacenamiento local (puede no estar disponible) ---------- */

  const CLAVES = {
    bombo: 'bingo:bombo',
    voz: 'bingo:voz',
    velocidad: 'bingo:velocidad',
  };

  const almacen = {
    leer(clave) {
      try {
        const valor = global.localStorage.getItem(clave);
        return valor === null ? null : JSON.parse(valor);
      } catch (e) {
        return null;
      }
    },
    borrar(clave) {
      try {
        global.localStorage.removeItem(clave);
      } catch (e) {
        /* Nada que hacer. */
      }
    },
    guardar(clave, valor) {
      try {
        global.localStorage.setItem(clave, JSON.stringify(valor));
      } catch (e) {
        /* Sin almacenamiento: el juego sigue funcionando sin guardar. */
      }
    },
  };

  /* ---------- Avisos ---------- */

  let temporizadorAviso = null;

  function avisar(texto) {
    const aviso = $('aviso');
    aviso.textContent = texto;
    aviso.className = 'aviso is-visible';
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
      aviso.className = 'aviso';
    }, 2800);
  }

  /* ---------- Bombo ---------- */

  let bombo = Bombo.desdeJSON(almacen.leer(CLAVES.bombo)) || new Bombo();
  let intervaloAuto = null;
  const HISTORIAL_VISIBLE = 10;

  const vozDisponible = 'speechSynthesis' in global && 'SpeechSynthesisUtterance' in global;

  function cantar(numero) {
    if (!vozDisponible || !$('chk-voz').checked) return;
    global.speechSynthesis.cancel();
    const frase = new global.SpeechSynthesisUtterance(String(numero));
    frase.lang = 'es-ES';
    global.speechSynthesis.speak(frase);
  }

  function crearTablero() {
    const tablero = $('tablero');
    const fragmento = doc.createDocumentFragment();
    for (let n = 1; n <= bombo.total; n++) {
      const celda = doc.createElement('span');
      celda.className = 'tablero-num';
      celda.id = 'num-' + n;
      celda.textContent = n;
      fragmento.appendChild(celda);
    }
    tablero.appendChild(fragmento);
  }

  function pintarBombo(animar = false) {
    const bola = $('bola-actual');
    bola.textContent = bombo.ultima ?? '–';
    if (animar) {
      bola.classList.remove('is-nueva');
      void bola.offsetWidth; // reinicia la animación
      bola.classList.add('is-nueva');
    }

    $('contador').textContent = bombo.salidas.length;

    const historial = $('historial');
    historial.innerHTML = '';
    bombo.salidas
      .slice(-HISTORIAL_VISIBLE - 1, -1)
      .reverse()
      .forEach((n) => {
        const li = doc.createElement('li');
        li.className = 'bola-mini';
        li.textContent = n;
        historial.appendChild(li);
      });

    const salidas = new Set(bombo.salidas);
    const ultima = bombo.ultima;
    for (let n = 1; n <= bombo.total; n++) {
      const celda = $('num-' + n);
      celda.classList.toggle('is-salida', salidas.has(n));
      celda.classList.toggle('is-ultima', n === ultima);
    }

    $('btn-sacar').disabled = bombo.vacio;
    $('btn-auto').disabled = bombo.vacio;
  }

  function sacarBola() {
    const numero = bombo.sacar();
    if (numero === null) {
      pararAuto();
      avisar('El bombo está vacío');
      return;
    }
    almacen.guardar(CLAVES.bombo, bombo);
    pintarBombo(true);
    cantar(numero);
    if (bombo.vacio) {
      pararAuto();
      avisar('¡Han salido las 90 bolas!');
    }
  }

  function arrancarAuto() {
    if (bombo.vacio) return;
    const btn = $('btn-auto');
    btn.setAttribute('aria-pressed', 'true');
    btn.textContent = '⏸ Pausar';
    sacarBola();
    intervaloAuto = setInterval(sacarBola, Number($('sel-velocidad').value));
  }

  function pararAuto() {
    clearInterval(intervaloAuto);
    intervaloAuto = null;
    const btn = $('btn-auto');
    btn.setAttribute('aria-pressed', 'false');
    btn.textContent = '▶ Automático';
  }

  function alternarAuto() {
    if (intervaloAuto) pararAuto();
    else arrancarAuto();
  }

  function reiniciarBombo() {
    if (bombo.salidas.length && !global.confirm('¿Empezar una nueva partida? Se vaciará el historial de bolas.')) return;
    pararAuto();
    bombo.reiniciar();
    almacen.guardar(CLAVES.bombo, bombo);
    pintarBombo();
    avisar('Nueva partida');
  }

  /* ---------- Inicio ---------- */

  function iniciar() {
    // Datos de versiones anteriores que ya no se usan (cartones y pestañas).
    almacen.borrar('bingo:cartones');
    almacen.borrar('bingo:pestana');

    crearTablero();
    pintarBombo();
    $('btn-sacar').addEventListener('click', () => {
      pararAuto();
      sacarBola();
    });
    $('btn-auto').addEventListener('click', alternarAuto);
    $('btn-reiniciar-bombo').addEventListener('click', reiniciarBombo);

    const selVelocidad = $('sel-velocidad');
    const velocidadGuardada = almacen.leer(CLAVES.velocidad);
    if (velocidadGuardada && selVelocidad.querySelector('option[value="' + velocidadGuardada + '"]')) {
      selVelocidad.value = velocidadGuardada;
    }
    selVelocidad.addEventListener('change', () => {
      almacen.guardar(CLAVES.velocidad, selVelocidad.value);
      if (intervaloAuto) {
        clearInterval(intervaloAuto);
        intervaloAuto = setInterval(sacarBola, Number(selVelocidad.value));
      }
    });

    if (vozDisponible) {
      const chkVoz = $('chk-voz');
      chkVoz.checked = almacen.leer(CLAVES.voz) === true;
      chkVoz.addEventListener('change', () => almacen.guardar(CLAVES.voz, chkVoz.checked));
    } else {
      $('opcion-voz').hidden = true;
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(window);
