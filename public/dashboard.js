// Formatea la fecha a formato legible en español porque el mongo lo guarda enorme
function formatearFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX') + ' ' + d.toLocaleTimeString('es-MX');
}

// Actualiza el reloj del header cada segundo
function actualizarHora() {
  document.getElementById('hora').textContent = new Date().toLocaleTimeString('es-MX');
}

// Aplica el estilo ok/alerta a una tarjeta y su badge
function estilizarTarjeta(idTarjeta, idBadge, esOk) {
  const tarjeta = document.getElementById(idTarjeta);
  const badge   = document.getElementById(idBadge);
  tarjeta.className = 'tarjeta ' + (esOk ? 'ok' : 'alerta');
  badge.className   = 'badge '   + (esOk ? 'ok' : 'alerta');
  badge.textContent  = esOk ? 'En rango' : 'Fuera de rango';
}

// Función principal que pide datos al servidor y actualiza la página
async function cargarDatos() {
  try {
    /* await es espera*/
    // última medición (lo que se ve en las tarjetas)
    const resUltima = await fetch('/api/datos/ultima'); /* le pide al servidor la última medición*/
    const ultima    = await resUltima.json();

    if (ultima && ultima.ph !== undefined) {
      const phOk   = ultima.ph >= 5.0 && ultima.ph <= 7.0;
      const tempOk = ultima.temperatura >= 20 && ultima.temperatura <= 40;
      const todoOk = phOk && tempOk;

      // Tarjeta pH
      document.getElementById('valor-ph').textContent = Number(ultima.ph).toFixed(2);
      estilizarTarjeta('tarjeta-ph', 'badge-ph', phOk);

      // Tarjeta temperatura
      document.getElementById('valor-temp').textContent = Number(ultima.temperatura).toFixed(1) + '°C';
      estilizarTarjeta('tarjeta-temp', 'badge-temp', tempOk);

      // Tarjeta estado general
      document.getElementById('icono-estado').textContent = todoOk ? 'OK' : 'ALERTA';
      estilizarTarjeta('tarjeta-estado', 'badge-estado', todoOk);
      document.getElementById('badge-estado').textContent = todoOk ? 'Lote OK' : 'ALERTA';
    }

    // Tabla de las anteriores mediciones 
    const resDatos = await fetch('/api/datos');
    const datos    = await resDatos.json();
    const tbody    = document.getElementById('cuerpo-tabla');
    tbody.innerHTML = ''; /* limpia la tabla antes de llenarla para no duplicar filas*/

    datos.slice(0, 20).forEach((m, i) => {
      const esOk = m.estado === 'OK';
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${formatearFecha(m.fecha)}</td>
          <td>${Number(m.ph).toFixed(2)}</td>
          <td>${Number(m.temperatura).toFixed(1)}°C</td>
          <td><span class="badge ${esOk ? 'ok' : 'alerta'}">${m.estado}</span></td>
        </tr>
      `; /*va agregando una fila nueva en cada vuelta sin borrar las anteriores*/
    });

  } catch (err) {
    console.error('Error al cargar datos:', err);
  }
}

// Arranque
actualizarHora();
cargarDatos();
setInterval(cargarDatos, 5000);   // recarga datos cada 5 segundos
setInterval(actualizarHora, 1000); // actualiza el reloj cada 1 segundo