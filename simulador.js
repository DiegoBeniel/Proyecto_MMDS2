const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function generarDatos() {
    return {
        ph: (Math.random() * (7 - 5) + 5).toFixed(2), // entre 5 y 7
        temperatura: (Math.random() * (40 - 20) + 20).toFixed(2) // entre 20 y 40
    };
}

setInterval(() => {
    const datos = generarDatos();

    fetch("http://localhost:3000/api/datos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Enviado:", datos);
    })
    .catch(err => {
        console.error("Error:", err);
    });

}, 5000); // cada 5 segundos