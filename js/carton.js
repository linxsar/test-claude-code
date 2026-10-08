/**
 * Cartón de Bingo español (90 bolas):
 *  - 3 filas x 9 columnas.
 *  - 5 números por fila (15 en total).
 *  - Columna 1: 1-9, columna 2: 10-19, ..., columna 9: 80-90.
 *  - Cada columna tiene entre 1 y 3 números, ordenados de arriba abajo.
 * Se expone como window.Bingo.Carton.
 */
(function (global) {
  'use strict';

  const Bingo = (global.Bingo = global.Bingo || {});
  const { aleatorio, barajar, rango } = Bingo.utils;

  const FILAS = 3;
  const COLUMNAS = 9;
  const POR_FILA = 5;
  const TOTAL_NUMEROS = FILAS * POR_FILA; // 15

  function rangoColumna(col) {
    const min = col === 0 ? 1 : col * 10;
    const max = col === COLUMNAS - 1 ? 90 : col * 10 + 9;
    return rango(min, max);
  }

  /** Decide cuántos números lleva cada columna (mínimo 1, máximo 3, suma 15). */
  function repartirPorColumna() {
    const cuenta = new Array(COLUMNAS).fill(1);
    let extra = TOTAL_NUMEROS - COLUMNAS;
    while (extra > 0) {
      const c = aleatorio(COLUMNAS);
      if (cuenta[c] < FILAS) {
        cuenta[c]++;
        extra--;
      }
    }
    return cuenta;
  }

  /**
   * Decide en qué filas va cada número de cada columna para que todas las filas
   * tengan exactamente 5. Se procesan primero las columnas con más números y se
   * eligen las filas con más hueco libre (algoritmo voraz de Gale-Ryser).
   */
  function distribuirEnFilas(cuenta) {
    const huecos = new Array(FILAS).fill(POR_FILA);
    const plantilla = Array.from({ length: FILAS }, () => new Array(COLUMNAS).fill(false));

    const orden = barajar(rango(0, COLUMNAS - 1)).sort((a, b) => cuenta[b] - cuenta[a]);

    for (const col of orden) {
      const filas = barajar(rango(0, FILAS - 1)).sort((a, b) => huecos[b] - huecos[a]);
      for (const fila of filas.slice(0, cuenta[col])) {
        plantilla[fila][col] = true;
        huecos[fila]--;
      }
    }

    return huecos.every((h) => h === 0) ? plantilla : null;
  }

  function generarNumeros() {
    let plantilla = null;
    let cuenta;
    while (!plantilla) {
      cuenta = repartirPorColumna();
      plantilla = distribuirEnFilas(cuenta);
    }

    const numeros = Array.from({ length: FILAS }, () => new Array(COLUMNAS).fill(null));
    for (let col = 0; col < COLUMNAS; col++) {
      const elegidos = barajar(rangoColumna(col)).slice(0, cuenta[col]).sort((a, b) => a - b);
      let i = 0;
      for (let fila = 0; fila < FILAS; fila++) {
        if (plantilla[fila][col]) numeros[fila][col] = elegidos[i++];
      }
    }
    return numeros;
  }

  let contadorId = 0;

  class Carton {
    constructor(numeros, marcados = []) {
      this.id = 'carton-' + Date.now().toString(36) + '-' + (contadorId++);
      this.numeros = numeros;
      this.marcados = new Set(marcados);
    }

    static generar() {
      return new Carton(generarNumeros());
    }

    /** Lista plana de los 15 números del cartón. */
    get todos() {
      return this.numeros.flat().filter((n) => n !== null);
    }

    contiene(numero) {
      return this.todos.includes(numero);
    }

    estaMarcado(numero) {
      return this.marcados.has(numero);
    }

    /** Marca o desmarca un número. Devuelve el nuevo estado. */
    alternar(numero) {
      if (!this.contiene(numero)) return false;
      if (this.marcados.has(numero)) {
        this.marcados.delete(numero);
        return false;
      }
      this.marcados.add(numero);
      return true;
    }

    limpiar() {
      this.marcados.clear();
    }

    /** Número de filas completamente marcadas. */
    lineasCompletas() {
      return this.numeros.filter((fila) =>
        fila.every((n) => n === null || this.marcados.has(n))
      ).length;
    }

    esBingo() {
      return this.marcados.size === TOTAL_NUMEROS;
    }

    toJSON() {
      return { numeros: this.numeros, marcados: Array.from(this.marcados) };
    }

    static desdeJSON(datos) {
      if (!datos || !Array.isArray(datos.numeros) || datos.numeros.length !== FILAS) return null;
      const carton = new Carton(datos.numeros, Array.isArray(datos.marcados) ? datos.marcados : []);
      return carton.todos.length === TOTAL_NUMEROS ? carton : null;
    }
  }

  Carton.FILAS = FILAS;
  Carton.COLUMNAS = COLUMNAS;

  Bingo.Carton = Carton;
})(window);
