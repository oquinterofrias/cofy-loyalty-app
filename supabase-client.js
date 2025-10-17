// supabase-client.js - Conexión a Supabase para COF& Loyalty System

// IMPORTANTE: Reemplaza TU_ANON_KEY_AQUI con tu anon key real de Supabase
const SUPABASE_URL = 'https://xtjxixczkgqkicprqfsp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anhpeGN6a2dxa2ljcHJxZnNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTg5ODUsImV4cCI6MjA3NjE3NDk4NX0.93ZW7bKuE7k9DioCHHaKWP4WOU1DfD_d3306RNrQOvY';

// Crear cliente de Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para verificar conexión
async function testConnection() {
  try {
    const { data, error } = await supabaseClient.from('settings').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

// CLIENTES
async function getCustomers() {
  const { data, error } = await supabaseClient
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error:', error);
    return [];
  }
  return data;
}

async function getCustomerByQR(qrCode) {
  const { data, error } = await supabaseClient
    .from('customers')
    .select('*')
    .eq('qr_code', qrCode)
    .single();
  if (error) return null;
  return data;
}
,
getCustomerByPhone: async function(phone) {
  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error getting customer by phone:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error:', err);
    return null;
  }
}

async function createCustomer(customerData) {
  const { data, error } = await supabaseClient
    .from('customers')
    .insert([customerData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateCustomer(id, updates) {
  const { data, error } = await supabaseClient
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUNCHES
async function addPunch(customerId, punchesBefore, punchesAfter, employee = 'Employee') {
  const { data, error } = await supabaseClient
    .from('punches')
    .insert([{
      customer_id: customerId,
      punches_before: punchesBefore,
      punches_after: punchesAfter,
      employee: employee
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// REWARDS
async function redeemReward(customerId, code, employee = 'Employee') {
  const { data, error } = await supabaseClient
    .from('rewards')
    .insert([{
      customer_id: customerId,
      code: code,
      employee: employee
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// SETTINGS
async function getSettings() {
  const { data, error } = await supabaseClient.from('settings').select('*');
  if (error) return {};
  const settings = {};
  data.forEach(item => {
    settings[item.key] = item.value;
  });
  return settings;
}

// ESTADÍSTICAS
async function getMonthlyStats() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const { data: allCustomers } = await supabaseClient.from('customers').select('id');
  const { data: activeCustomers } = await supabaseClient.from('customers').select('id').gte('last_visit', firstDay);
  const { data: monthlyPunches } = await supabaseClient.from('punches').select('id').gte('created_at', firstDay);
  const { data: monthlyRewards } = await supabaseClient.from('rewards').select('id').gte('redeemed_date', firstDay);
  const { data: readyRewards } = await supabaseClient.from('customers').select('id').eq('punches', 10);
  
  return {
    totalCustomers: allCustomers?.length || 0,
    activeCustomers: activeCustomers?.length || 0,
    monthlyPunches: monthlyPunches?.length || 0,
    monthlyRewards: monthlyRewards?.length || 0,
    withReward: readyRewards?.length || 0
  };
}

// CÓDIGOS DE PREMIO
const REWARD_CODES = [
  'COFFEE', 'ESPRES', 'LATTE1', 'MOCHA1', 'BEANS1', 'ORIGIN', 'SMOOTH', 'STRONG',
  'SWEET1', 'CREAM1', 'FROTH1', 'CAPUCH', 'VANILA', 'CINNMN', 'AROMA1', 'ROAST1',
  'BLEND1', 'BREW01', 'GRIND1', 'COLOMB', 'ANDEAN', 'BOGOTA', 'HUILA1', 'TINTO1'
];

function getRandomRewardCode(usedCodes = []) {
  const available = REWARD_CODES.filter(code => !usedCodes.includes(code));
  if (available.length === 0) return REWARD_CODES[Math.floor(Math.random() * REWARD_CODES.length)];
  return available[Math.floor(Math.random() * available.length)];
}

// Exportar funciones
window.supabaseAPI = {
  testConnection,
  getCustomers,
  getCustomerByQR,
  createCustomer,
  updateCustomer,
  addPunch,
  redeemReward,
  getSettings,
  getMonthlyStats,
  getRandomRewardCode
};

console.log('✅ Supabase client cargado');
