const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        // Definimos dirección inicial basada en la velocidad
        this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.isColliding = false;
    }

    draw(context) {
        context.beginPath();
        // El color cambia a azul solo si isColliding es true (efecto flash)
        context.strokeStyle = this.isColliding ? "#0000FF" : this.originalColor;
        context.fillStyle = this.isColliding ? "#0000FF" : this.originalColor;
        
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 18px Arial";
        context.fillText(this.text, this.posX, this.posY);
        
        context.lineWidth = 3;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Rebote con bordes laterales
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Rebote con bordes superiores/inferiores
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }

    // Nuevo método para resolver la colisión y rebotar
    resolveCollision(otherCircle) {
        let dx = otherCircle.posX - this.posX;
        let dy = otherCircle.posY - this.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (this.radius + otherCircle.radius)) {
            // 1. Activar el estado de colisión (para el color azul)
            this.isColliding = true;
            otherCircle.isColliding = true;

            // 2. Rebotar: Invertir las direcciones de ambos círculos
            this.dx = -this.dx;
            this.dy = -this.dy;
            otherCircle.dx = -otherCircle.dx;
            otherCircle.dy = -otherCircle.dy;

            // 3. Corrección de posición (para evitar que se queden "pegados")
            // Los separamos un poco en su nueva dirección inmediatamente
            this.posX += this.dx;
            this.posY += this.dy;
            otherCircle.posX += otherCircle.dx;
            otherCircle.posY += otherCircle.dy;
        }
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 20 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        let speed = Math.random() * 4 + 1;
        let text = `${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);

    // Resetear estado de colisión en cada frame
    circles.forEach(circle => circle.isColliding = false);

    // Comprobar colisiones entre todos los pares posibles
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            // Si colisionan, el método resolveCollision se encarga del rebote
            circles[i].resolveCollision(circles[j]);
        }
    }

    // Dibujar y actualizar posiciones
    circles.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(animate);
}

generateCircles(20);
animate();