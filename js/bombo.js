/**
 * Bombo: saca bolas al azar sin repetir.
 * Se expone como window.Bingo.Bombo.
 */
(function (global) {
  'use strict';

  const Bingo = (global.Bingo = global.Bingo || {});

  /** Entero aleatorio en [0, max). Usa crypto si está disponible. */
  function aleatorio(max) {
    if (global.crypto && global.crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      global.crypto.getRandomValues(buf);
      return buf[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  /** Baraja un array en el sitio (Fisher-Yates) y lo devuelve. */
  function barajar(lista) {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = aleatorio(i + 1);
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
  }

  function rango(desde, hasta) {
    const lista = [];
    for (let n = desde; n <= hasta; n++) lista.push(n);
    return lista;
  }

  class Bombo {
    constructor(total = 90) {
      this.total = total;
      this.reiniciar();
    }

    reiniciar() {
      this.pendientes = barajar(rango(1, this.total));
      this.salidas = [];
    }

    /** Saca la siguiente bola. Devuelve el número o null si el bombo está vacío. */
    sacar() {
      if (this.pendientes.length === 0) return null;
      const bola = this.pendientes.pop();
      this.salidas.push(bola);
      return bola;
    }

    get ultima() {
      return this.salidas.length ? this.salidas[this.salidas.length - 1] : null;
    }

    get quedan() {
      return this.pendientes.length;
    }

    get vacio() {
      return this.pendientes.length === 0;
    }

    haSalido(numero) {
      return this.salidas.includes(numero);
    }

    toJSON() {
      return { total: this.total, pendientes: this.pendientes, salidas: this.salidas };
    }

    /** Restaura un bombo guardado. Devuelve null si los datos no son válidos. */
    static desdeJSON(datos) {
      if (!datos || !Array.isArray(datos.pendientes) || !Array.isArray(datos.salidas)) return null;
      const total = Number(datos.total) || 90;
      if (datos.pendientes.length + datos.salidas.length !== total) return null;
      const bombo = new Bombo(total);
      bombo.pendientes = datos.pendientes.slice();
      bombo.salidas = datos.salidas.slice();
      return bombo;
    }
  }

  Bingo.Bombo = Bombo;
  Bingo.utils = { aleatorio, barajar, rango };
})(window);
