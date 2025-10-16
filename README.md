# COF& Loyalty Card System

Digital loyalty card management system for COF& Colombian Coffee.

## 🎯 Features

- ✅ Customer registration with QR codes
- ✅ Digital wallet integration (Apple Wallet / Google Pay)
- ✅ Punch tracking system (10 punches = 1 free drink)
- ✅ Reward code validation
- ✅ Administrator dashboard with statistics
- ✅ Employee interface for daily operations
- ✅ Real-time database with Supabase
- ✅ Birthday tracking for promotions

## 🏪 Business Information

- **Name:** COF&
- **Slogan:** Sustainably Grown Colombian Coffee
- **Address:** 1209 Cornwall Ave
- **Social:** @cofy.wa
- **Colors:** Brown (#3D1E1E), Orange (#F5A623), Green (#7FA650)

## 🚀 Setup Instructions

### 1. Configure Supabase

Open `supabase-client.js` and replace:
```javascript
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_AQUI';
```

With your actual Supabase anon key.

### 2. Deploy to Netlify

1. Connect this GitHub repository to Netlify
2. Deploy automatically
3. Your app will be live!

### 3. Default Admin Password
```
admin123
```

**⚠️ Change this in Supabase settings table after first login!**

## 📱 How It Works

### For Employees:
1. Login as Employee
2. Scan customer QR code
3. Give punch or validate reward

### For Customers:
1. Register in-store (via register.html)
2. Receive digital card with QR code
3. Show QR at checkout to earn punches
4. Get free drink after 10 punches

### For Administrators:
1. Login with password
2. View statistics
3. Manage customer database
4. Export reports

## 🔐 Security

- Row Level Security (RLS) enabled in Supabase
- Admin access protected by password
- Customer data encrypted
- HTTPS enforced

## 💾 Database Structure

### Tables:
- `customers` - Customer information and punch counts
- `punches` - History of all punches given
- `rewards` - History of redeemed rewards
- `scheduled_messages` - Promotional messages
- `settings` - App configuration

## 🎨 Customization

All brand colors and settings are stored in the Supabase `settings` table and can be updated through the admin interface.

## 📊 Integration

- **POS System:** TOAST
- **Default Reward Code:** FREEDRINK (configurable)

## 📞 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for COF& Coffee**
