import { Account, Transaction, Category } from '@/types';
import { collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generar ID único
const generateId = () => Math.random().toString(36).substr(2, 9);

// Función para generar fecha aleatoria en los últimos N días
const randomDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * daysAgo));
  return pastDate.toISOString().split('T')[0];
};

// Función para monto aleatorio
const randomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Datos de ejemplo realistas
const EXPENSE_CATEGORIES = [
  { name: 'Supermercado', icon: '🛒', color: '#4CAF50' },
  { name: 'Restaurantes', icon: '🍽️', color: '#FF9800' },
  { name: 'Transporte', icon: '🚗', color: '#2196F3' },
  { name: 'Servicios', icon: '💡', color: '#9C27B0' },
  { name: 'Entretenimiento', icon: '🎮', color: '#E91E63' },
  { name: 'Salud', icon: '💊', color: '#00BCD4' },
  { name: 'Educación', icon: '📚', color: '#673AB7' },
  { name: 'Ropa', icon: '👕', color: '#FF5722' },
  { name: 'Mascotas', icon: '🐕', color: '#795548' },
  { name: 'Otros', icon: '📦', color: '#607D8B' },
];

const INCOME_CATEGORIES = [
  { name: 'Salario', icon: '💼', color: '#4CAF50' },
  { name: 'Freelance', icon: '💻', color: '#2196F3' },
  { name: 'Inversiones', icon: '📈', color: '#FF9800' },
  { name: 'Otros Ingresos', icon: '💰', color: '#9C27B0' },
];

const EXPENSE_DESCRIPTIONS = {
  'Supermercado': [
    'Compras semanales Carrefour',
    'Mercado local',
    'Walmart Express',
    'Verdulería del barrio',
    'Día Supermercado',
  ],
  'Restaurantes': [
    'Almuerzo con amigos',
    'Cena familiar',
    'Café y medialunas',
    'Delivery pizza',
    'Sushi take away',
  ],
  'Transporte': [
    'Carga SUBE',
    'Uber al trabajo',
    'Nafta YPF',
    'Peaje autopista',
    'Estacionamiento',
  ],
  'Servicios': [
    'Luz del mes',
    'Gas natural',
    'Internet Fibertel',
    'Agua corriente',
    'Netflix suscripción',
  ],
  'Entretenimiento': [
    'Entradas cine',
    'Spotify Premium',
    'Gimnasio mensual',
    'Libros Amazon',
    'Steam juego',
  ],
  'Salud': [
    'Farmacia',
    'Obra social',
    'Odontólogo',
    'Análisis clínicos',
    'Consulta médica',
  ],
  'Educación': [
    'Curso online Udemy',
    'Libros universitarios',
    'Material escolar',
    'Cuota colegio',
    'Inglés mensual',
  ],
  'Ropa': [
    'Zapatillas Nike',
    'Ropa de trabajo',
    'Campera invierno',
    'Remeras básicas',
    'Jeans Levis',
  ],
  'Mascotas': [
    'Veterinario',
    'Alimento perro',
    'Arena gatos',
    'Vacunas',
    'Baño canino',
  ],
  'Otros': [
    'Regalo cumpleaños',
    'Reparación celular',
    'Envío Correo Argentino',
    'Artículos hogar',
    'Peluquería',
  ],
};

export async function seedDatabase(userId: string, householdId: string) {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // 1. CREAR CATEGORÍAS
    console.log('📁 Creando categorías...');
    const categoryIds: { [key: string]: string } = {};

    // Categorías de gastos
    for (const cat of EXPENSE_CATEGORIES) {
      const docRef = await addDoc(collection(db, `households/${householdId}/categories`), {
        name: cat.name,
        type: 'expense',
        icon: cat.icon,
        color: cat.color,
      });
      categoryIds[cat.name] = docRef.id;
    }

    // Categorías de ingresos
    for (const cat of INCOME_CATEGORIES) {
      const docRef = await addDoc(collection(db, `households/${householdId}/categories`), {
        name: cat.name,
        type: 'income',
        icon: cat.icon,
        color: cat.color,
      });
      categoryIds[cat.name] = docRef.id;
    }

    // 2. CREAR CUENTAS
    console.log('🏦 Creando cuentas...');
    const accounts: { id: string; name: string; balance: number }[] = [];

    // Cuenta bancaria principal
    const bankAccount = await addDoc(collection(db, `households/${householdId}/accounts`), {
      name: 'Banco Galicia',
      type: 'bank',
      initialBalance: 150000,
      currentBalance: 150000,
      currency: 'ARS',
      color: '#FF6B00',
    });
    accounts.push({ id: bankAccount.id, name: 'Banco Galicia', balance: 150000 });

    // Efectivo
    const cashAccount = await addDoc(collection(db, `households/${householdId}/accounts`), {
      name: 'Efectivo',
      type: 'cash',
      initialBalance: 25000,
      currentBalance: 25000,
      currency: 'ARS',
      color: '#4CAF50',
    });
    accounts.push({ id: cashAccount.id, name: 'Efectivo', balance: 25000 });

    // Tarjeta de crédito
    const creditCard = await addDoc(collection(db, `households/${householdId}/accounts`), {
      name: 'Visa Platinum',
      type: 'credit',
      initialBalance: 0,
      currentBalance: 0,
      currency: 'ARS',
      color: '#1A237E',
      limit: 500000,
      closingDate: 15,
      paymentDate: 10,
    });
    accounts.push({ id: creditCard.id, name: 'Visa Platinum', balance: 0 });

    // Cuenta de ahorro
    const savingsAccount = await addDoc(collection(db, `households/${householdId}/accounts`), {
      name: 'Caja de Ahorro USD',
      type: 'bank',
      initialBalance: 5000,
      currentBalance: 5000,
      currency: 'USD',
      color: '#00695C',
    });
    accounts.push({ id: savingsAccount.id, name: 'Caja de Ahorro USD', balance: 5000 });

    // 3. CREAR TRANSACCIONES (últimos 90 días)
    console.log('💳 Creando transacciones...');
    const transactions: Transaction[] = [];

    // Generar salario mensual (3 meses)
    for (let month = 0; month < 3; month++) {
      const salaryDate = new Date();
      salaryDate.setMonth(salaryDate.getMonth() - month);
      salaryDate.setDate(1); // Primer día del mes

      await addDoc(collection(db, `households/${householdId}/transactions`), {
        amount: 450000,
        date: salaryDate.toISOString().split('T')[0],
        description: 'Salario mensual',
        type: 'income',
        categoryId: categoryIds['Salario'],
        accountId: bankAccount.id,
        notes: 'Depósito haberes',
      });
    }

    // Generar ingresos freelance aleatorios
    for (let i = 0; i < 8; i++) {
      await addDoc(collection(db, `households/${householdId}/transactions`), {
        amount: randomAmount(30000, 120000),
        date: randomDate(90),
        description: `Trabajo freelance proyecto ${i + 1}`,
        type: 'income',
        categoryId: categoryIds['Freelance'],
        accountId: bankAccount.id,
        notes: 'Pago por servicios',
      });
    }

    // Generar gastos realistas (150-200 transacciones)
    const numTransactions = randomAmount(150, 200);
    
    for (let i = 0; i < numTransactions; i++) {
      // Elegir categoría aleatoria
      const category = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
      const descriptions = EXPENSE_DESCRIPTIONS[category.name as keyof typeof EXPENSE_DESCRIPTIONS];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];

      // Montos realistas según categoría
      let minAmount = 1000;
      let maxAmount = 15000;

      switch (category.name) {
        case 'Supermercado':
          minAmount = 8000;
          maxAmount = 35000;
          break;
        case 'Restaurantes':
          minAmount = 5000;
          maxAmount = 25000;
          break;
        case 'Transporte':
          minAmount = 2000;
          maxAmount = 20000;
          break;
        case 'Servicios':
          minAmount = 5000;
          maxAmount = 50000;
          break;
        case 'Entretenimiento':
          minAmount = 3000;
          maxAmount = 20000;
          break;
        case 'Salud':
          minAmount = 5000;
          maxAmount = 40000;
          break;
        case 'Educación':
          minAmount = 10000;
          maxAmount = 60000;
          break;
        case 'Ropa':
          minAmount = 15000;
          maxAmount = 80000;
          break;
      }

      // Elegir cuenta aleatoria (70% banco, 20% efectivo, 10% crédito)
      const rand = Math.random();
      let accountId;
      if (rand < 0.7) {
        accountId = bankAccount.id;
      } else if (rand < 0.9) {
        accountId = cashAccount.id;
      } else {
        accountId = creditCard.id;
      }

      await addDoc(collection(db, `households/${householdId}/transactions`), {
        amount: randomAmount(minAmount, maxAmount),
        date: randomDate(90),
        description,
        type: 'expense',
        categoryId: categoryIds[category.name],
        accountId,
        notes: i % 10 === 0 ? 'Nota de ejemplo para esta transacción' : '',
      });
    }

    // 4. CREAR ALGUNAS TRANSFERENCIAS
    console.log('🔄 Creando transferencias...');
    for (let i = 0; i < 10; i++) {
      await addDoc(collection(db, `households/${householdId}/transactions`), {
        amount: randomAmount(10000, 50000),
        date: randomDate(90),
        description: 'Transferencia entre cuentas',
        type: 'transfer',
        accountId: bankAccount.id,
        toAccountId: Math.random() > 0.5 ? cashAccount.id : savingsAccount.id,
        notes: 'Movimiento interno',
      });
    }

    console.log('✅ ¡Datos creados exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${EXPENSE_CATEGORIES.length + INCOME_CATEGORIES.length} categorías`);
    console.log(`   - ${accounts.length} cuentas`);
    console.log(`   - ~${numTransactions + 20} transacciones`);
    
    return true;

  } catch (error) {
    console.error('❌ Error creando datos:', error);
    return false;
  }
}

// Función para limpiar todos los datos (usar con cuidado)
export async function clearAllData(householdId: string) {
  console.log('🗑️ Limpiando datos...');
  
  try {
    // Limpiar transacciones
    const transactionsSnapshot = await getDocs(collection(db, `households/${householdId}/transactions`));
    const deletePromises = transactionsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Limpiar cuentas
    const accountsSnapshot = await getDocs(collection(db, `households/${householdId}/accounts`));
    const deleteAccountsPromises = accountsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteAccountsPromises);

    // Limpiar categorías
    const categoriesSnapshot = await getDocs(collection(db, `households/${householdId}/categories`));
    const deleteCategoriesPromises = categoriesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deleteCategoriesPromises);

    console.log('✅ Datos limpiados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error limpiando datos:', error);
    return false;
  }
}
