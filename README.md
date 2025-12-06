# 💰 App Presupuesto - Gestión Financiera Personal

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12-orange?style=flat-square&logo=firebase)

Una aplicación moderna y elegante para gestionar tus finanzas personales. Controla tus ingresos, gastos, cuentas bancarias y tarjetas de crédito desde un solo lugar.

## ✨ Características

- 📊 **Dashboard Interactivo**: Visualiza tu situación financiera en tiempo real
- 💳 **Gestión de Cuentas**: Administra cuentas bancarias, efectivo y tarjetas de crédito
- 📈 **Registro de Transacciones**: Añade, edita y elimina ingresos y gastos
- 🔍 **Filtros y Búsqueda**: Encuentra transacciones rápidamente
- 🏷️ **Categorías**: Organiza tus gastos e ingresos por categorías
- 📱 **Diseño Responsive**: Funciona perfectamente en móvil y escritorio
- 🌙 **Tema Oscuro Premium**: Interfaz moderna con efectos glass
- 🔥 **Firebase**: Autenticación y base de datos en tiempo real
- ⚡ **Rápido y Optimizado**: Construido con Next.js 16 y React 19

## 🚀 Demo en Vivo

Visita la aplicación: [https://pqem.github.io/App-Presupuesto/](https://pqem.github.io/App-Presupuesto/)

## 📸 Capturas de Pantalla

### Dashboard
Vista general de tu situación financiera con tarjetas de resumen y actividad reciente.

### Transacciones
Lista completa de transacciones con filtros y búsqueda avanzada.

### Cuentas
Gestiona todas tus cuentas bancarias y tarjetas de crédito.

## 🛠️ Tecnologías Utilizadas

- **[Next.js 16](https://nextjs.org/)** - Framework de React
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript con tipos
- **[Firebase](https://firebase.google.com/)** - Backend como servicio (Authentication + Firestore)
- **CSS Modules** - Estilos personalizados

## 📦 Instalación

### Requisitos Previos

- Node.js 18 o superior
- npm, yarn, pnpm o bun
- Cuenta de Firebase (gratuita)

### Pasos de Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/pqem/App-Presupuesto.git
cd App-Presupuesto
```

2. **Instala las dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configura Firebase**

   a. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   
   b. Activa Authentication (Email/Password)
   
   c. Crea una base de datos Firestore
   
   d. Copia las credenciales de tu proyecto

4. **Configura las variables de entorno**

   Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id_aqui
```

5. **Inicia el servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

6. **Abre tu navegador**

   Visita [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
App-Presupuesto/
├── src/
│   ├── app/                    # Páginas de la aplicación
│   │   ├── accounts/          # Gestión de cuentas
│   │   ├── transactions/      # Lista de transacciones
│   │   ├── settings/          # Configuración
│   │   ├── page.tsx           # Dashboard (página principal)
│   │   ├── layout.tsx         # Layout general
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes reutilizables
│   │   ├── TransactionForm.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── CreditCard.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BottomNav.tsx
│   │   └── ...
│   ├── context/               # Contextos de React
│   │   ├── StorageContext.tsx # Gestión de datos
│   │   └── UiContext.tsx      # Estado de UI
│   ├── types/                 # Definiciones de TypeScript
│   │   └── index.ts
│   ├── lib/                   # Configuración
│   │   └── firebase.ts        # Config de Firebase
│   └── utils/                 # Funciones auxiliares
│       └── format.ts
├── public/                    # Archivos estáticos
├── .env.local                 # Variables de entorno (no incluido)
├── package.json              
├── tsconfig.json             
└── README.md
```

## 🎯 Uso

### Crear tu Primera Transacción

1. Inicia sesión o regístrate
2. Haz clic en "Nueva Transacción"
3. Selecciona el tipo (Gasto o Ingreso)
4. Completa los datos
5. ¡Listo! Tu transacción se guardará automáticamente

### Gestionar Cuentas

1. Ve a la sección "Cuentas"
2. Visualiza todas tus cuentas bancarias y tarjetas
3. Revisa los balances actualizados en tiempo real

### Filtrar Transacciones

1. Usa la barra de búsqueda para encontrar transacciones específicas
2. Filtra por tipo (Ingresos/Gastos)
3. Filtra por cuenta bancaria

## 🔐 Seguridad

- Autenticación segura con Firebase
- Los datos se almacenan por usuario en Firestore
- Reglas de seguridad configuradas en Firebase
- Variables de entorno para credenciales sensibles

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. ¡Despliega!

```bash
npm run build
npm start
```

### Otras Plataformas

La aplicación es compatible con:
- Netlify
- Railway
- Render
- Y cualquier plataforma que soporte Next.js

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si quieres mejorar este proyecto:

1. Haz un Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Próximas Características

- [ ] Gráficos y estadísticas avanzadas
- [ ] Exportar datos a PDF/Excel
- [ ] Presupuestos por categoría
- [ ] Recordatorios de pagos
- [ ] Modo claro/oscuro
- [ ] Múltiples monedas
- [ ] Transacciones recurrentes automatizadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Pablo**

- GitHub: [@pqem](https://github.com/pqem)
- Repositorio: [App-Presupuesto](https://github.com/pqem/App-Presupuesto)

## 🙏 Agradecimientos

- Next.js por el increíble framework
- Firebase por el backend
- La comunidad de desarrolladores

---

⭐ Si este proyecto te fue útil, ¡dale una estrella en GitHub!

💡 ¿Tienes sugerencias? Abre un Issue o envía un Pull Request.
