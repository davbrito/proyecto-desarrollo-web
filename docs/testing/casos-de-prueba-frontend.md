# Casos de Prueba - Frontend (UNEG Lab)

Este documento detalla los casos de prueba para las funcionalidades principales del frontend, siguiendo la estructura de gestión de calidad.

| ID | Módulo/Característica | Descripción | Precondiciones | Pasos de Ejecución | Datos de Prueba | Resultado Esperado | Prioridad |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **TC-AUTH-001** | Autenticación | Registro de usuario exitoso | Usuario no autenticado, base de datos limpia. | 1. Navegar a /registro<br>2. Completar todos los campos válidos<br>3. Clic en "Crear cuenta" | Usuario: `testuser`, Email: `test@uneg.edu.ve`, Pass: `Password123!` | El usuario es redirigido al inicio ("/") y se muestra mensaje de éxito. | Alta |
| **TC-AUTH-002** | Autenticación | Validación de campos requeridos en registro | Formulario de registro abierto. | 1. Dejar campos vacíos<br>2. Clic en "Crear cuenta" | N/A | Se muestran mensajes de error: "Nombre de usuario es requerido", "El nombre completo es requerido", etc. | Alta |
| **TC-RES-001** | Reservas | Creación de reserva (Flujo completo) | Usuario autenticado, laboratorio disponible. | 1. Ir a /reservas/nueva<br>2. Seleccionar fecha y lab<br>3. Llenar descripción<br>4. Clic en Siguiente<br>5. Confirmar fecha final<br>6. Clic en Confirmar | Lab: "Lab A", Hora: 08:00 - 10:00 | La reserva se crea, se muestra Toast de éxito y redirige a la lista de reservas. | Alta |
| **TC-RES-002** | Reservas | Validación de conflicto de horario | Existencia de una reserva previa en el mismo bloque. | 1. Intentar reservar en un horario marcado como "No disponible" (rojo) | Fecha: Hoy, Hora: 10:00 (Ya ocupada) | El sistema debe impedir la selección o mostrar alert de "Selecciona otra hora". | Media |
| **TC-UI-001** | Interfaz / UX | Adaptabilidad móvil (Sidebar) | Navegador en resolución móvil (< 768px). | 1. Redimensionar ventana o usar DevTools<br>2. Interactuar con el trigger del Sidebar | N/A | El Sidebar se contrae en un Drawer o se oculta, activándose mediante el icono de menú. | Baja |
| **TC-UI-002** | Interfaz / UX | Cambio de tema (Dark/Light) | Aplicación cargada. | 1. Clic en selector de tema en el sidebar | Tema: Oscuro / Claro | Los colores de la interfaz cambian instantáneamente respetando el diseño Shadcn/UI. | Baja |

## Resumen de Ejecución
*   **Total de Casos:** 6
*   **Estado:** Pendiente de ejecución formal (automatizados parcialmente en Vitest).
