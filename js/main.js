/**
 * Interfaz: conecta el bombo y los cartones con el HTML.
 */
(function (global) {
  'use strict';

  const { Bombo, Carton } = global.Bingo;
  const doc = global.document;
  const $ = (id) => doc.getElementById(id);

  /* ---------- Almacenamiento local (puede no estar disponible) ---------- */

  const CLAVES = {
    bombo: 'bingo:bombo',
    cartones: 'bingo:cartones',
    pestana: 'bingo:pestana',
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

  function avisar(texto, tipo = '') {
    const aviso = $('aviso');
    aviso.textContent = texto;
    aviso.className = 'aviso is-visible' + (tipo ? ' aviso-' + tipo : '');
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => {
      aviso.className = 'aviso';
    }, 2800);
  }

  /* ---------- Pestañas (solo visibles en móvil y tablet) ---------- */

  function activarPestana(nombre) {
    doc.querySelectorAll('.tab').forEach((tab) => {
      const activa = tab.dataset.panel === nombre;
      tab.classList.toggle('is-active', activa);
      tab.setAttribute('aria-selected', String(activa));
    });
    doc.querySelectorAll('.panel').forEach((panel) => {
      panel.classList.toggle('is-active', panel.id === 'panel-' + nombre);
    });
    almacen.guardar(CLAVES.pestana, nombre);
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

  /* ---------- Cartones ---------- */

  let cartones = (almacen.leer(CLAVES.cartones) || [])
    .map(Carton.desdeJSON)
    .filter(Boolean);

  function guardarCartones() {
    almacen.guardar(CLAVES.cartones, cartones);
  }

  function generarCartones(cantidad) {
    cartones = Array.from({ length: cantidad }, () => Carton.generar());
    guardarCartones();
    pintarCartones();
  }

  function pintarCartones() {
    const contenedor = $('cartones');
    contenedor.innerHTML = '';

    cartones.forEach((carton, indice) => {
      const tarjeta = doc.createElement('article');
      tarjeta.className = 'carton';
      tarjeta.id = carton.id;

      const cabecera = doc.createElement('header');
      cabecera.className = 'carton-cabecera';
      const titulo = doc.createElement('h3');
      titulo.textContent = 'Cartón ' + (indice + 1);
      const estado = doc.createElement('span');
      estado.className = 'carton-estado';
      cabecera.append(titulo, estado);

      const rejilla = doc.createElement('div');
      rejilla.className = 'carton-rejilla';
      carton.numeros.forEach((fila) => {
        fila.forEach((numero) => {
          if (numero === null) {
            const vacia = doc.createElement('span');
            vacia.className = 'celda celda-vacia';
            vacia.setAttribute('aria-hidden', 'true');
            rejilla.appendChild(vacia);
            return;
          }
          const celda = doc.createElement('button');
          celda.type = 'button';
          celda.className = 'celda';
          celda.textContent = numero;
          celda.dataset.numero = numero;
          celda.dataset.indice = indice;
          rejilla.appendChild(celda);
        });
      });

      tarjeta.append(cabecera, rejilla);
      contenedor.appendChild(tarjeta);
      pintarEstadoCarton(carton);
    });
  }

  function pintarEstadoCarton(carton) {
    const tarjeta = $(carton.id);
    if (!tarjeta) return;

    tarjeta.querySelectorAll('.celda[data-numero]').forEach((celda) => {
      const marcado = carton.estaMarcado(Number(celda.dataset.numero));
      celda.classList.toggle('is-marcada', marcado);
      celda.setAttribute('aria-pressed', String(marcado));
    });

    const lineas = carton.lineasCompletas();
    const bingo = carton.esBingo();
    tarjeta.classList.toggle('is-bingo', bingo);
    tarjeta.querySelector('.carton-estado').textContent = bingo
      ? '¡BINGO!'
      : lineas
        ? lineas + (lineas === 1 ? ' línea' : ' líneas')
        : carton.marcados.size + ' / 15';
  }

  function alPulsarCelda(evento) {
    const celda = evento.target.closest('.celda[data-numero]');
    if (!celda) return;

    const carton = cartones[Number(celda.dataset.indice)];
    const lineasAntes = carton.lineasCompletas();
    carton.alternar(Number(celda.dataset.numero));
    guardarCartones();
    pintarEstadoCarton(carton);

    if (carton.esBingo()) {
      avisar('🎉 ¡BINGO!', 'bingo');
    } else if (carton.lineasCompletas() > lineasAntes) {
      avisar('✅ ¡Línea!', 'linea');
    }
  }

  function limpiarMarcas() {
    cartones.forEach((carton) => carton.limpiar());
    guardarCartones();
    cartones.forEach(pintarEstadoCarton);
  }

  /* ---------- Inicio ---------- */

  function iniciar() {
    // Pestañas
    doc.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => activarPestana(tab.dataset.panel));
    });
    const pestanaGuardada = almacen.leer(CLAVES.pestana);
    if (pestanaGuardada === 'bombo' || pestanaGuardada === 'cartones') activarPestana(pestanaGuardada);

    // Bombo
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

    // Cartones
    const selCantidad = $('sel-cantidad');
    if (cartones.length) {
      const opcion = selCantidad.querySelector('option[value="' + cartones.length + '"]');
      if (opcion) selCantidad.value = String(cartones.length);
      pintarCartones();
    } else {
      generarCartones(Number(selCantidad.value));
    }

    $('btn-nuevos-cartones').addEventListener('click', () => {
      const hayMarcas = cartones.some((c) => c.marcados.size > 0);
      if (hayMarcas && !global.confirm('¿Generar cartones nuevos? Perderás los actuales.')) return;
      generarCartones(Number(selCantidad.value));
      avisar('Cartones nuevos listos');
    });
    $('btn-limpiar-marcas').addEventListener('click', limpiarMarcas);
    $('cartones').addEventListener('click', alPulsarCelda);
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})(window);
