# 🏥 Sistema de Gestión Médica - Medical App

Aplicación web moderna para la gestión integral de citas médicas, doctores y pacientes construida con Vue 3, Vite y Axios.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Configuración del Proyecto](#-configuración-del-proyecto)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Reutilizables](#-componentes-reutilizables)
- [Vistas (Views)](#-vistas-views)
- [Clientes API](#-clientes-api)
- [Sistema de Rutas](#-sistema-de-rutas)
- [Autenticación](#-autenticación)
- [Guía de Uso](#-guía-de-uso)
- [Variables CSS](#-variables-css)

---

## ✨ Características

- ✅ **CRUD Completo**: Gestión de Doctores, Pacientes y Citas
- 🔐 **Autenticación JWT**: Sistema seguro de login con tokens
- 🎨 **UI Moderna**: Interfaz con gradientes, animaciones y diseño responsivo
- 📊 **Tablas Dinámicas**: Visualización de datos con componentes reutilizables
- 🔄 **Actualización en Tiempo Real**: Botones de refresh con animaciones
- 🚫 **Validación de Estados**: Control de acciones según estado ACTIVO/INACTIVO
- 📱 **Responsive**: Diseño adaptable a diferentes dispositivos
- 💾 **Estado Persistente**: Uso de localStorage para mantener sesión

---

## 🛠️ Tecnologías

| Tecnología     | Versión   | Propósito               |
| -------------- | --------- | ----------------------- |
| **Vue.js**     | 3.5.27    | Framework principal     |
| **Vue Router** | 5.0.1     | Navegación SPA          |
| **Axios**      | 1.13.4    | Cliente HTTP para API   |
| **Vite**       | 7.3.1     | Build tool y dev server |
| **Node.js**    | >=20.19.0 | Entorno de ejecución    |

---

## 🚀 Configuración del Proyecto

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install
```

### Scripts Disponibles

```bash
# Desarrollo (Hot-Reload)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Configuración de APIs

Edita las URLs base en los clientes:

**`src/clients/MedicalClient.js`**:

```javascript
const API_URL = 'http://localhost:8080/medical/api/v1.0'
```

**`src/clients/AuthorizationClient.js`**:

```javascript
const AUTH_URL = 'http://localhost:8082/auth/token'
```

---

## 📁 Estructura del Proyecto

```
pw-vue-medical-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/              # Estilos globales y recursos
│   │   ├── base.css
│   │   ├── main.css
│   │   └── logo.svg
│   ├── clients/             # Clientes HTTP
│   │   ├── AuthorizationClient.js
│   │   └── MedicalClient.js
│   ├── components/          # Componentes reutilizables
│   │   ├── GenericForm.vue
│   │   ├── GenericTable.vue
│   │   ├── MessageComponent.vue
│   │   └── FormularioLogin.vue
│   ├── router/              # Configuración de rutas
│   │   └── index.js
│   ├── views/               # Vistas principales
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── CitasView.vue
│   │   ├── DoctoresView.vue
│   │   └── PacientesView.vue
│   ├── App.vue              # Componente raíz
│   └── main.js              # Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── jsconfig.json
```

---

## 🧩 Componentes Reutilizables

### 1. **GenericForm.vue**

Formulario genérico y configurable para crear/editar registros.

#### Props

| Prop          | Tipo    | Requerido | Default     | Descripción                         |
| ------------- | ------- | --------- | ----------- | ----------------------------------- |
| `fields`      | Array   | ✅        | -           | Definición de campos del formulario |
| `initial`     | Object  | ❌        | `{}`        | Valores iniciales del formulario    |
| `submitLabel` | String  | ❌        | `'Guardar'` | Texto del botón submit              |
| `showCancel`  | Boolean | ❌        | `false`     | Mostrar botón cancelar              |

#### Eventos

- `@submit` - Emitido al enviar el formulario con los datos
- `@cancel` - Emitido al cancelar el formulario

#### Estructura de Fields

```javascript
fields: [
  {
    name: 'nombre', // Campo del modelo
    label: 'Nombre', // Etiqueta visible
    type: 'text', // text|email|date|select|textarea|datetime-local
    full: false, // Ocupar ancho completo (opcional)
    props: {}, // Props HTML adicionales (opcional)
    options: [] // Para select: [{value, label}] o función
  }
]
```

#### Ejemplo de Uso

```vue
<GenericForm
  :fields="doctorFields"
  :initial="nuevoDoctor"
  submitLabel="Guardar Doctor"
  :showCancel="true"
  @submit="handleFormSubmit"
  @cancel="closeModal"
/>
```

#### Tipos de Campo Soportados

- **text**: Input de texto
- **email**: Input de email con validación
- **date**: Selector de fecha
- **datetime-local**: Selector de fecha y hora
- **select**: Menú desplegable (requiere `options`)
- **textarea**: Área de texto multilínea

---

### 2. **GenericTable.vue**

Tabla genérica con slots para personalización de celdas.

#### Props

| Prop       | Tipo   | Requerido | Default | Descripción                  |
| ---------- | ------ | --------- | ------- | ---------------------------- |
| `columns`  | Array  | ✅        | -       | Definición de columnas       |
| `rows`     | Array  | ❌        | `[]`    | Datos a mostrar              |
| `keyField` | String | ❌        | `'id'`  | Campo único para keys de Vue |

#### Estructura de Columns

```javascript
columns: [
  { field: 'id', label: 'ID' },
  { field: 'nombre', label: 'Nombre' },
  { field: 'actions', label: 'Acciones' }
]
```

#### Slots

- **`#cell`**: Personalizar contenido de celdas
  - Props del slot: `{ row, col }`

#### Ejemplo de Uso

```vue
<GenericTable :columns="doctorColumns" :rows="doctors" key-field="id">
  <template #cell="{ row, col }">
    <template v-if="col.field === 'status'">
      <span :class="['badge', row.status === 'ACTIVO' ? 'bg-active' : 'bg-inactive']">
        {{ row.status }}
      </span>
    </template>
    <template v-else-if="col.field === 'actions'">
      <button @click="editDoctor(row)">✏️</button>
      <button @click="deleteDoctor(row.id)">🗑️</button>
    </template>
    <template v-else>
      {{ row[col.field] }}
    </template>
  </template>
</GenericTable>
```

---

### 3. **MessageComponent.vue**

Componente para mostrar mensajes de feedback al usuario.

#### Props

| Prop   | Tipo   | Default  | Descripción                      |
| ------ | ------ | -------- | -------------------------------- |
| `text` | String | `''`     | Texto del mensaje                |
| `type` | String | `'info'` | Tipo: `success`, `error`, `info` |

#### Estilos por Tipo

- **success**: Fondo verde claro, borde verde
- **error**: Fondo rojo claro, borde rojo
- **info**: Fondo azul claro, borde azul

#### Ejemplo de Uso

```vue
<MessageComponent :text="message?.text" :type="message?.type" />
```

```javascript
// En el componente padre
showMessage(text, type = 'success') {
  this.message = { text, type }
  setTimeout(() => {
    this.message = null
  }, 4000)
}
```

---

### 4. **FormularioLogin.vue**

Formulario especializado para autenticación con iconos.

#### Props

| Prop      | Tipo    | Default | Descripción                   |
| --------- | ------- | ------- | ----------------------------- |
| `loading` | Boolean | `false` | Estado de carga durante login |

#### Eventos

- `@submit` - Emite `{username, password}` al enviar

#### Características

- 👤 Icono de usuario en campo username
- 🔒 Icono de candado en campo password
- Spinner animado durante carga
- Validación HTML5 (required)
- Autofocus en username

#### Ejemplo de Uso

```vue
<FormularioLogin :loading="loading" @submit="login" />
```

---

## 📄 Vistas (Views)

### 1. **LoginView.vue**

Vista de autenticación del sistema.

#### Funcionalidades

- Formulario de login con validación
- Autenticación JWT
- Redirección automática después del login
- Manejo de errores de autenticación
- Estado de carga durante la petición

#### Flujo de Autenticación

1. Usuario ingresa credenciales
2. Se llama a `getTokenFacade(username, password)`
3. Token se guarda en localStorage
4. Redirección a HomeView
5. Router guard valida en cada navegación

---

### 2. **DoctoresView.vue**

Vista de gestión de doctores (CRUD completo).

#### Data Properties

```javascript
{
  doctors: [],              // Lista de doctores
  nuevoDoctor: {           // Modelo del formulario
    nombre: '',
    apellido: '',
    especialidad: '',
    email: '',
    telefono: '',
    numOficina: ''
  },
  doctorFields: [],        // Configuración de campos
  doctorColumns: [],       // Configuración de columnas
  message: null,           // Mensaje de feedback
  loading: false,          // Estado de carga
  showModal: false,        // Control de modal
  isEditing: false,        // Modo edición
  editingId: null          // ID del doctor en edición
}
```

#### Métodos Principales

| Método                      | Descripción                                                     |
| --------------------------- | --------------------------------------------------------------- |
| `getAll()`                  | Carga todos los doctores y crea campo derivado `nombreCompleto` |
| `openModal()`               | Abre modal en modo creación                                     |
| `closeModal()`              | Cierra modal y resetea estado                                   |
| `editDoctor(doctor)`        | Valida estado ACTIVO y abre modal en modo edición               |
| `deleteDoctor(id)`          | Valida estado, confirma y elimina doctor                        |
| `handleFormSubmit(payload)` | Crea o actualiza según `isEditing`                              |
| `showMessage(text, type)`   | Muestra mensaje temporal (4 segundos)                           |

#### Validaciones

- ✅ Solo se pueden editar doctores ACTIVOS
- ✅ Solo se pueden eliminar doctores ACTIVOS
- ✅ Confirmación antes de eliminar
- ✅ Botones deshabilitados visualmente para INACTIVOS

#### Columnas de Tabla

- ID
- Nombre Completo
- Especialidad
- Email
- Teléfono
- Oficina
- **Estado** (badge ACTIVO/INACTIVO)
- **Acciones** (Editar ✏️, Eliminar 🗑️)

---

### 3. **PacientesView.vue**

Vista de gestión de pacientes (CRUD completo).

#### Data Properties

```javascript
{
  pacientes: [],
  nuevoPaciente: {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
    direccion: ''
  },
  pacienteFields: [],
  pacienteColumns: [],
  message: null,
  error: null,
  loading: false,
  showModal: false,
  isEditing: false,
  editingId: null
}
```

#### Métodos Principales

| Método                      | Descripción                                   |
| --------------------------- | --------------------------------------------- |
| `getAll()`                  | Carga pacientes y crea campo `nombreCompleto` |
| `editPaciente(paciente)`    | Valida estado ACTIVO antes de editar          |
| `deletePaciente(id)`        | Valida estado, confirma y elimina             |
| `handleFormSubmit(payload)` | Crea o actualiza paciente                     |

#### Validaciones

- ✅ Solo pacientes ACTIVOS pueden editarse/eliminarse
- ✅ Mensaje de error para pacientes INACTIVOS
- ✅ Confirmación de eliminación
- ✅ Validación de email HTML5

#### Columnas de Tabla

- ID
- Nombre Completo
- Fecha de Nacimiento
- Email
- Teléfono
- Dirección
- **Estado** (badge)
- **Acciones** (Editar, Eliminar)

---

### 4. **CitasView.vue**

Vista de gestión de citas médicas con cancelación.

#### Data Properties

```javascript
{
  citas: [],
  doctors: [],             // Para select de doctores
  pacientes: [],           // Para select de pacientes
  nuevaCita: {
    fechaCita: '',
    doctorId: '',
    pacienteId: ''
  },
  minDateTime: '',         // Fecha mínima (ahora)
  citaFields: [],
  citaColumns: [],
  message: null,
  loading: false,
  error: null,
  showModal: false,
  isEditing: false,
  editingId: null
}
```

#### Métodos Principales

| Método                        | Descripción                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| `loadAllData()`               | Carga citas, doctores y pacientes en paralelo con `Promise.all()` |
| `getAll(silent)`              | Carga solo citas (sin mensaje si `silent=true`)                   |
| `setMinDateTime()`            | Establece fecha/hora mínima como ahora                            |
| `editCita(cita)`              | Valida estado ACTIVA, convierte fecha a formato datetime-local    |
| `cancelCita(id)`              | Cambia estado a CANCELADA vía API                                 |
| `handleFormSubmit(payload)`   | Crea o actualiza cita                                             |
| `formatFecha(fechaStr)`       | Formatea fecha para visualización (DD/MM/YYYY HH:mm)              |
| `formatDateTimeForApi(value)` | Convierte formato HTML5 a formato API                             |

#### Características Especiales

**Data Joining Manual**:

```javascript
const [appointments, doctors, patients] = await Promise.all([...])

this.citas = appointments.map((c) => {
  const doctor = doctors.find(d => d.id === c.doctorId)
  const paciente = patients.find(p => p.id === c.pacienteId)

  return {
    ...c,
    doctor: doctor ? `Dr. ${doctor.nombre} ${doctor.apellido}` : '',
    paciente: paciente ? `${paciente.nombre} ${paciente.apellido}` : ''
  }
})
```

**Select Dinámicos**:

```javascript
citaFields: [
  {
    name: 'doctorId',
    label: 'Doctor',
    type: 'select',
    options: () =>
      this.doctors.map((d) => ({
        value: d.id,
        label: `Dr. ${d.nombre} - ${d.especialidad}`
      }))
  }
]
```

#### Validaciones

- ✅ Solo citas ACTIVAS pueden editarse/cancelarse
- ✅ Fecha mínima es la actual
- ✅ Requiere doctor, paciente y fecha
- ✅ Conversión de formatos de fecha

#### Columnas de Tabla

- ID
- Fecha (formato DD/MM/YYYY HH:mm)
- Doctor (nombre completo con título)
- Paciente (nombre completo)
- **Estado** (badge ACTIVA/CANCELADA)
- **Acciones** (Editar ✏️, Cancelar ❌)

---

### 5. **HomeView.vue**

Vista principal/dashboard del sistema.

#### Funcionalidades

- Menú de navegación a las diferentes secciones
- Tarjetas de acceso rápido
- Estadísticas del sistema
- Botón de cierre de sesión

---

## 🔌 Clientes API

### AuthorizationClient.js

Cliente para autenticación JWT.

#### Funciones

**`getTokenFacade(user, password)`**

- Obtiene token JWT del servidor de autenticación
- Guarda en localStorage: `jwt_token`, `isAuthenticated`, `expiresAt`
- Lanza error si las credenciales son inválidas

**`logOutFacade()`**

- Elimina tokens del localStorage
- Limpia estado de autenticación

#### Uso

```javascript
import { getTokenFacade, logOutFacade } from '@/clients/AuthorizationClient'

// Login
await getTokenFacade('usuario', 'password')

// Logout
logOutFacade()
router.push('/login')
```

---

### MedicalClient.js

Cliente para operaciones CRUD de la API médica.

#### Arquitectura

- **Funciones Internas**: Realizan llamadas HTTP con Axios
- **Facades**: Exportan interfaces públicas
- **Headers**: Función `getAuthHeaders()` añade JWT a cada petición

#### Funciones Disponibles

**Doctores**:

- `getDoctorsFacade()` - GET /doctores
- `createDoctorFacade(doctor)` - POST /doctores
- `updateDoctorFacade(id, doctor)` - PUT /doctores/{id}
- `deleteDoctorFacade(id)` - DELETE /doctores/{id}

**Pacientes**:

- `getPatientsFacade()` - GET /pacientes
- `createPatientFacade(patient)` - POST /pacientes
- `updatePatientFacade(id, patient)` - PUT /pacientes/{id}
- `deletePatientFacade(id)` - DELETE /pacientes/{id}

**Citas**:

- `getAppointmentsFacade()` - GET /citas
- `createAppointmentFacade(appointment)` - POST /citas
- `updateAppointmentFacade(id, appointment)` - PUT /citas/{id}
- `cancelAppointmentFacade(id)` - PATCH /citas/{id}/cancelar

#### Autenticación Automática

```javascript
const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token')
  return { headers: { Authorization: `Bearer ${token}` } }
}
```

Todas las peticiones incluyen automáticamente el token JWT.

---

## 🛣️ Sistema de Rutas

### Configuración (router/index.js)

```javascript
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requireAuthorization: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('../views/CitasView.vue'),
    meta: { requireAuthorization: true }
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: () => import('../views/DoctoresView.vue'),
    meta: { requireAuthorization: true }
  },
  {
    path: '/patients',
    name: 'patients',
    component: () => import('../views/PacientesView.vue'),
    meta: { requireAuthorization: true }
  }
]
```

### Navigation Guard

```javascript
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token')
  const expiresAt = localStorage.getItem('expiresAt')

  if (to.meta.requireAuthorization) {
    if (!token || !expiresAt) {
      next('/login')
    } else if (new Date().getTime() > parseInt(expiresAt)) {
      localStorage.clear()
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
```

#### Protección de Rutas

- ✅ Verifica presencia de token
- ✅ Valida expiración del token
- ✅ Redirige a /login si no autorizado
- ✅ Limpia localStorage si token expiró

---

## 🔐 Autenticación

### Flujo Completo

1. **Login**:

   ```
   Usuario → FormularioLogin → getTokenFacade() → localStorage → Router
   ```

2. **Navegación**:

   ```
   Router Guard → Valida Token → Permite/Redirige
   ```

3. **Peticiones API**:

   ```
   Componente → MedicalClient → getAuthHeaders() → Axios → API
   ```

4. **Logout**:
   ```
   Usuario → logOutFacade() → Clear localStorage → Redirect Login
   ```

### Datos en localStorage

```javascript
{
  jwt_token: "eyJhbGciOiJIUzI1NiIs...",
  isAuthenticated: "true",
  expiresAt: "1739456789000"
}
```

---

## 📖 Guía de Uso

### Crear un Nuevo Doctor

1. Ir a `/doctors`
2. Clic en **"👨‍⚕️ Nuevo Doctor"**
3. Completar formulario modal
4. Clic en **"Guardar Doctor"**
5. Mensaje de confirmación aparece
6. Tabla se actualiza automáticamente

### Editar un Doctor

1. En la tabla, clic en **✏️** (solo si está ACTIVO)
2. Modal se abre con datos precargados
3. Modificar campos necesarios
4. Clic en **"Actualizar Doctor"**

### Eliminar un Doctor

1. Clic en **🗑️** (solo si está ACTIVO)
2. Confirmar en el diálogo
3. Doctor se elimina vía API
4. Tabla se recarga

### Actualizar Lista

1. Clic en botón **🔄** en header
2. Animación de rotación
3. Datos se recargan desde API

### Agendar una Cita

1. Ir a `/appointments`
2. Clic en **"📅 Agendar Cita"**
3. Seleccionar doctor del dropdown
4. Seleccionar paciente del dropdown
5. Elegir fecha y hora (mínimo: ahora)
6. Clic en **"Agendar Cita"**

### Cancelar una Cita

1. En la tabla, clic en **❌** (solo ACTIVA)
2. Cita cambia a estado CANCELADA
3. Botones de edición/cancelación se deshabilitan

---

## 🎨 Variables CSS

El proyecto usa variables CSS para tematización consistente:

```css
:root {
  --color-primary: #0b6bcb;
  --color-accent: #1aa3a8;
  --color-danger: #c62828;
  --color-text: #1c2025;
  --color-text-muted: #636b74;
  --color-surface: #ffffff;
  --color-surface-muted: #f5f5f5;
  --color-border: #dde7ee;
  --color-border-strong: #cdd7e1;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-2: 0 1px 4px rgba(0, 0, 0, 0.08);
}
```

### Clases de Utilidad

**Botones**:

- `.btn-add` - Botón principal con gradiente
- `.btn-refresh` - Botón circular de actualización
- `.btn-primary` - Botón secundario con borde
- `.btn-action` - Botón de acción en tabla
- `.btn-disabled` - Estado deshabilitado

**Badges**:

- `.badge` - Badge base
- `.bg-active` - Verde para ACTIVO
- `.bg-inactive` - Rojo para INACTIVO

**Estados**:

- `.loading-state` - Indicador de carga
- `.empty-state` - Estado vacío
- `.message` - Mensaje de feedback

---

## 🐛 Solución de Problemas

### Error: "Cannot read property of undefined"

**Causa**: Datos no cargados antes de renderizar.

**Solución**: Usar `v-if` para renderizar condicionalmente.

```vue
<GenericTable v-if="doctors.length > 0" ... />
```

### Error: "Network Error" en peticiones

**Causa**: API no disponible o URL incorrecta.

**Solución**:

1. Verificar que el backend esté corriendo
2. Revisar URLs en `MedicalClient.js` y `AuthorizationClient.js`
3. Verificar CORS en el backend

### Token Expirado

**Síntoma**: Redirigido a login constantemente.

**Solución**:

1. Hacer login nuevamente
2. Verificar que `expiresAt` sea correcto
3. Sincronizar fecha/hora del sistema

### Modal no se muestra

**Causa**: `showModal` no cambia a `true`.

**Solución**: Verificar método `openModal()` y binding `v-if="showModal"`.

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`GenericForm.vue`)
- **Variables**: camelCase (`nuevoDoctor`, `isEditing`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Métodos**: camelCase descriptivo (`handleFormSubmit`, `showMessage`)

### Estructura de Componentes Vue

```vue
<template>
  <!-- HTML -->
</template>

<script>
export default {
  name: 'ComponentName',
  components: {},
  props: {},
  emits: [],
  data() {},
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped>
/* CSS específico del componente */
</style>
```

---

## 👥 Configuración de Desarrollo

### IDE Recomendado

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

**Desactivar**: Vetur (conflicto con Vue Official)

### Extensiones de Navegador

**Chrome/Edge/Brave**:

- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

**Firefox**:

- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Configuración de Vite

Ver [Vite Configuration Reference](https://vite.dev/config/).

---

## 📦 Build y Deployment

### Build de Producción

```bash
npm run build
```

Genera archivos optimizados en `/dist`.

### Preview del Build

```bash
npm run preview
```

### Variables de Entorno

Crear `.env.production`:

```env
VITE_API_URL=https://api.production.com
VITE_AUTH_URL=https://auth.production.com
```

Usar en código:

```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 📄 Licencia

Este proyecto es privado y de uso educativo.

---

## 🤝 Contribución

Para contribuir:

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.
