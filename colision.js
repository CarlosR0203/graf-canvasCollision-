const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let window_height = window.innerHeight;
let window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

let puntaje = 0;
let multiplicadorVelocidad = 1;

// --- CARGA DE IMÁGENES ---
// Asegúrate de que los archivos se llamen exactamente así y estén en la misma carpeta
let imagenFondo = new Image();
imagenFondo.src = "img/fondo.jpg"; 

let imagenObjeto = new Image();
imagenObjeto.src = "img/enemy.png"; 
// -------------------------

class ObjetoCayendo {
    constructor() {
        this.size = Math.random() * 30 + 30; // Tamaño aleatorio
        this.reiniciar();
    }

    // Método para reaparecer arriba con nueva velocidad y posición
    reiniciar() {
        this.posX = Math.random() * (window_width - this.size);
        this.posY = -(Math.random() * 500 + 50); // Inicia por encima del margen superior
        this.velocidadBase = Math.random() * 2 + 1; // Velocidades diferentes
    }

    dibujar(context) {
        // Verifica si la imagen ya cargó correctamente
        if (imagenObjeto.complete && imagenObjeto.naturalHeight !== 0) {
            context.drawImage(imagenObjeto, this.posX, this.posY, this.size, this.size);
        } else {
            // Color por defecto mientras carga la imagen
            context.fillStyle = "#FF5733";
            context.fillRect(this.posX, this.posY, this.size, this.size);
        }
    }

    actualizar(context) {
        // Reglas de velocidad según el contador
        if (puntaje > 15) {
            multiplicadorVelocidad = 2.5; // Alta
        } else if (puntaje > 10) {
            multiplicadorVelocidad = 1.5; // Media
        } else {
            multiplicadorVelocidad = 1;   // Inicial
        }

        // Efecto de caída libre
        this.posY += this.velocidadBase * multiplicadorVelocidad;

        // Cae indefinidamente: si sale de la pantalla, reaparece arriba
        if (this.posY > window_height) {
            this.reiniciar();
        }

        this.dibujar(context);
    }

    // Detectar si las coordenadas del mouse tocan el objeto
    fueClickeado(mouseX, mouseY) {
        return mouseX >= this.posX && mouseX <= this.posX + this.size &&
               mouseY >= this.posY && mouseY <= this.posY + this.size;
    }
}

let objetos = [];
for (let i = 0; i < 20; i++) {
    objetos.push(new ObjetoCayendo());
}

// Detectar coordenadas del mouseX y mouseY al hacer clic
canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = 0; i < objetos.length; i++) {
        if (objetos[i].fueClickeado(mouseX, mouseY)) {
            objetos[i].reiniciar(); // Elimina el objeto (lo manda arriba de nuevo)
            puntaje++;              // Actualiza contador
            break;                  // Evita eliminar varios de un solo clic
        }
    }
});

function dibujarContador() {
    // Fondo blanco semitransparente para que el texto siempre sea legible
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(window_width - 160, 10, 150, 40);
    
    // Texto del contador
    ctx.fillStyle = "black";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText("Eliminadas: " + puntaje, window_width - 20, 30);
}

function animar() {
    // Dibujar fondo
    if (imagenFondo.complete && imagenFondo.naturalHeight !== 0) {
        ctx.drawImage(imagenFondo, 0, 0, window_width, window_height);
    } else {
        ctx.fillStyle = "#fdfd96"; // Fondo amarillo pastel por defecto
        ctx.fillRect(0, 0, window_width, window_height);
    }

    // Actualizar todos los objetos
    objetos.forEach(obj => {
        obj.actualizar(ctx);
    });

    dibujarContador();

    requestAnimationFrame(animar);
}

// Ajustar el canvas si redimensionan la ventana
window.addEventListener('resize', () => {
    window_height = window.innerHeight;
    window_width = window.innerWidth;
    canvas.height = window_height;
    canvas.width = window_width;
});

animar();