// supabase-client.js - Conexión a Supabase para COF& Loyalty System

// IMPORTANTE: Reemplaza TU_ANON_KEY_AQUI con tu anon key real de Supabase
const SUPABASE_URL = 'https://xtjxixczkgqkicprqfsp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0anh4Y3prZ3FraWNwcnFmc3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyOTAzNzI0OCwiZXhwIjoyMDQ0NjEzMjQ4fQ.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

// Crear cliente de Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función para verificar conexión
async function testConnection() {
  try {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    return true;
  } catch (err) {
    console.error('Error de conexión:', err);
    return false;
  }
}

// API de funciones
window.supabaseAPI = {
  // Test de conexión
  testConnection: testConnection,

  // Obtener configuración (settings)
  getSettings: async function() {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('*');
      
      if (error) {
        console.error('Error getting settings:', error);
        return {};
      }
      
      // Convertir array de settings a objeto
      const settings = {};
      data.forEach(item => {
        settings[item.key] = item.value;
      });
      
      return settings;
    } catch (err) {
      console.error('Error:', err);
      return {};
    }
  },

  // Actualizar un setting específico
  updateSettings: async function(key, value) {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .update({ value: value })
        .eq('key', key);
      
      if (error) {
        console.error('Error updating settings:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  },

  // Obtener cliente por QR
  getCustomerByQR: async function(qrCode) {
    try {
      const { data, error } = await supabaseClient
        .from('customers')
        .select('*')
        .eq('qr_code', qrCode)
        .single();
      
      if (error) return null;
      return data;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },

  // Obtener cliente por teléfono
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
  },

  // Crear nuevo cliente
  createCustomer: async function(customerData) {
    try {
      const { data, error } = await supabaseClient
        .from('customers')
        .insert([customerData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating customer:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },

  // Actualizar cliente
  updateCustomer: async function(customerId, updates) {
    try {
      const { data, error } = await supabaseClient
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating customer:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return null;
    }
  },

  // Obtener todos los clientes
  getCustomers: async function() {
    try {
      const { data, error } = await supabaseClient
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting customers:', error);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  },

  // Agregar punch (registro en historial)
  addPunch: async function(customerId, punchesBefore, punchesAfter, employee = 'System') {
    try {
      const { data, error } = await supabaseClient
        .from('punches')
        .insert([{
          customer_id: customerId,
          punches_before: punchesBefore,
          punches_after: punchesAfter,
          employee: employee
        }]);
      
      if (error) {
        console.error('Error adding punch:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  },

  // Obtener todos los punches (para estadísticas)
  getAllPunches: async function() {
    try {
      const { data, error } = await supabaseClient
        .from('punches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting punches:', error);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  },

  // Canjear premio
  redeemReward: async function(customerId, code, employee = 'System') {
    try {
      const { data, error } = await supabaseClient
        .from('rewards')
        .insert([{
          customer_id: customerId,
          code: code,
          employee: employee
        }]);
      
      if (error) {
        console.error('Error redeeming reward:', error);
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error:', err);
      return false;
    }
  },

  // Obtener todos los premios canjeados
  getAllRewards: async function() {
    try {
      const { data, error } = await supabaseClient
        .from('rewards')
        .select('*')
        .order('redeemed_date', { ascending: false });
      
      if (error) {
        console.error('Error getting rewards:', error);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  },

  // Obtener historial de punches de un cliente
  getCustomerPunches: async function(customerId) {
    try {
      const { data, error } = await supabaseClient
        .from('punches')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting customer punches:', error);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  },

  // Obtener premios canjeados de un cliente
  getCustomerRewards: async function(customerId) {
    try {
      const { data, error } = await supabaseClient
        .from('rewards')
        .select('*')
        .eq('customer_id', customerId)
        .order('redeemed_date', { ascending: false });
      
      if (error) {
        console.error('Error getting customer rewards:', error);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  }
};

// Test automático de conexión al cargar
console.log('Supabase client initialized');
testConnection();
