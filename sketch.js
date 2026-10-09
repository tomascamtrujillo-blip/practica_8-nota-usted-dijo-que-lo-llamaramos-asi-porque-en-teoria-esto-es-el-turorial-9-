
/* eslint-disable no-undef, no-unused-vars */

// DECLARACIONES

// Variable donde se almacena el lienzo
let canvas;

// Alto y ancho del lienzo
let canvasHeight = 220;
let canvasWidth;

// Ruta del archivo de audio
const URL_AUDIO = "aud/ASM - Tutorial 7 - audio.ogg";

// Variables para controlar el audio
let velocidad;
let volumen;
let soundFile;

// Variable para calcular la amplitud del audio
let medidaAmplitud;

// Diámetro del círculo
let diametroCirculo;

// Efecto de reverberación
let reverberacion;

// Posición actual del círculo
let centroX;
let centroY;

// Posición de destino del círculo
let destinoX;
let destinoY;

// false = Reto 1: movimiento inmediato
// true = Reto 2: movimiento animado
let animacionActiva = true;


// FUNCIÓN DE PRECARGA

function preload() {
  soundFormats("ogg");
  soundFile = loadSound(URL_AUDIO);
}


// FUNCIÓN DE CONFIGURACIÓN

function setup() {
  canvasWidth = windowWidth;

  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");

  // Valores iniciales del audio
  velocidad = 1.0;
  volumen = 0.5;

  soundFile.setVolume(volumen);
  soundFile.pause();

  // Medición de amplitud
  medidaAmplitud = new p5.Amplitude();

  // Posición inicial del círculo
  centroX = width / 2;
  centroY = height / 2;

  destinoX = centroX;
  destinoY = centroY;

  // Configuración de la reverberación
  reverberacion = new p5.Reverb();
  reverberacion.disconnect();
  reverberacion.process(soundFile, 2, 1);
  reverberacion.drywet(0.8);
}


// FUNCIÓN DE DIBUJO

function draw() {
  // Fondo gris
  background(128, 128, 128);

  // Obtener amplitud del audio
  let amplitudAudio = medidaAmplitud.getLevel();

  // Calcular el diámetro del círculo
  diametroCirculo = map(
    amplitudAudio,
    0,
    1,
    0,
    200
  );

  // Evitar que el círculo supere el tamaño del lienzo
  diametroCirculo = min(
    diametroCirculo,
    height,
    width
  );

  // RETO 2: animar el movimiento
  if (animacionActiva) {
    centroX = lerp(centroX, destinoX, 0.08);
    centroY = lerp(centroY, destinoY, 0.08);
  }

  // Dibujar el círculo rojo
  fill(255, 0, 0);
  noStroke();

  circle(centroX, centroY, diametroCirculo);
}


// CAMBIAR EL TAMAÑO DEL LIENZO

windowResized = function () {
  canvasWidth = windowWidth;

  resizeCanvas(canvasWidth, canvasHeight);

  // Mantener el círculo dentro del lienzo
  let radio = diametroCirculo / 2 || 0;

  centroX = constrain(centroX, radio, width - radio);
  centroY = constrain(centroY, radio, height - radio);

  destinoX = constrain(destinoX, radio, width - radio);
  destinoY = constrain(destinoY, radio, height - radio);
};


// CONTROL DEL AUDIO CON EL TECLADO

function keyTyped() {

  // P: reproducir o pausar
  if (key === "p" || key === "P") {

    if (soundFile.isPlaying()) {
      soundFile.pause();
    } else {
      soundFile.play();
      soundFile.rate(velocidad);
      soundFile.setVolume(volumen);
    }

  // L: aumentar velocidad
  } else if (
    (key === "l" || key === "L") &&
    soundFile.isPlaying()
  ) {

    velocidad = min(2.0, velocidad + 0.1);
    soundFile.rate(velocidad);

    console.log("Velocidad:", velocidad.toFixed(1));

  // J: disminuir velocidad
  } else if (
    (key === "j" || key === "J") &&
    soundFile.isPlaying()
  ) {

    velocidad = max(0.1, velocidad - 0.1);
    soundFile.rate(velocidad);

    console.log("Velocidad:", velocidad.toFixed(1));

  // +: aumentar volumen
  } else if (
    key === "+" &&
    soundFile.isPlaying()
  ) {

    volumen = min(1.0, volumen + 0.1);
    soundFile.setVolume(volumen);

    console.log("Volumen:", volumen.toFixed(1));

  // -: disminuir volumen
  } else if (
    key === "-" &&
    soundFile.isPlaying()
  ) {

    volumen = max(0.0, volumen - 0.1);
    soundFile.setVolume(volumen);

    console.log("Volumen:", volumen.toFixed(1));
  }
}


// INTERACCIÓN CON EL RATÓN

function mouseClicked() {

  // Ignorar clics fuera del lienzo
  if (
    mouseX < 0 ||
    mouseX > width ||
    mouseY < 0 ||
    mouseY > height
  ) {
    return false;
  }

  // Calcular la distancia entre el clic y el centro
  let distancia = dist(
    centroX,
    centroY,
    mouseX,
    mouseY
  );

  // Comprobar si el clic fue dentro del círculo
  if (distancia <= diametroCirculo / 2) {

    // Activar reverberación
    reverberacion.connect();

    console.log("Reverberación activada");

  } else {

    // Desactivar reverberación
    reverberacion.disconnect();

    console.log("Reverberación desactivada");

    // Mantener el círculo dentro del lienzo
    let radio = diametroCirculo / 2;

    let nuevoX = constrain(
      mouseX,
      radio,
      width - radio
    );

    let nuevoY = constrain(
      mouseY,
      radio,
      height - radio
    );

    // RETO 1: movimiento inmediato
    if (!animacionActiva) {

      centroX = nuevoX;
      centroY = nuevoY;

      destinoX = nuevoX;
      destinoY = nuevoY;

    } else {

      // RETO 2: movimiento animado
      destinoX = nuevoX;
      destinoY = nuevoY;
    }
  }

  return false;
}