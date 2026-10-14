// ============================================
// Frontend - Consumo de API REST
// Práctica 3 Unidad 2
// ============================================

const API_URL = 'http://localhost:3000/api/recursos';

// Variable global para la gráfica
let miGrafica = null;

// ============================================
// 1. Obtener datos de la API
// ============================================
async function cargarRecursos() {
  try {
    const respuesta = await fetch(API_URL);
    
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    
    const recursos = await respuesta.json();
    console.log('✅ Datos recibidos:', recursos);
    
    // Mostrar en tabla
    mostrarTabla(recursos);
    
    // Mostrar en gráfica
    mostrarGrafica(recursos);
    
  } catch (error) {
    console.error('❌ Error al cargar recursos:', error);
    
    document.getElementById('tabla-datos').innerHTML = `
      <p class="estado" style="color: #c00;">
        ❌ Error al conectar con la API.<br>
        <small>Verifica que el servidor en http://localhost:3000 esté corriendo.</small>
      </p>
    `;
  }
}

// ============================================
// 2. Mostrar tabla HTML
// ============================================
function mostrarTabla(recursos) {
  const contenedor = document.getElementById('tabla-datos');
  
  if (recursos.length === 0) {
    contenedor.innerHTML = '<p class="estado">No hay recursos registrados.</p>';
    return;
  }
  
  // Construir filas
  let filas = '';
  recursos.forEach(recurso => {
    filas += `
      <tr>
        <td><strong>${recurso.nombre}</strong></td>
        <td>$${recurso.precio.toLocaleString()}</td>
        <td>${recurso.categoria}</td>
      </tr>
    `;
  });
  
  // Inyectar tabla en el DOM
  contenedor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Categoría</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>
  `;
}

// ============================================
// 3. Mostrar gráfica con Chart.js
// ============================================
function mostrarGrafica(recursos) {
  // Extraer datos en arreglos separados
  const nombres = recursos.map(r => r.nombre);
  const precios = recursos.map(r => r.precio);
  const categorias = recursos.map(r => r.categoria);
  
  // Colores según la categoría
  const colores = categorias.map(cat => {
    if (cat === 'Electrónica') return 'rgba(0, 86, 179, 0.7)';
    if (cat === 'Accesorios') return 'rgba(97, 218, 251, 0.7)';
    return 'rgba(200, 200, 200, 0.7)';
  });
  
  // Destruir gráfica anterior si existe
  if (miGrafica) {
    miGrafica.destroy();
  }
  
  // Crear nueva gráfica
  const ctx = document.getElementById('miGrafica').getContext('2d');
  miGrafica = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: nombres,
      datasets: [{
        label: 'Precio ($)',
        data: precios,
        backgroundColor: colores,
        borderColor: colores.map(c => c.replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return '$' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// ============================================
// 4. Cargar al abrir la página
// ============================================
document.addEventListener('DOMContentLoaded', cargarRecursos);