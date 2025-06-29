# BAYSCOM Energy Limited - ERP System

A comprehensive Enterprise Resource Planning (ERP) system for BAYSCOM Energy Limited, featuring multiple modules for managing oil & gas operations.

## 🏢 About BAYSCOM Energy Limited

BAYSCOM Energy Limited is a Nigerian energy company operating in the oil and gas sector. This ERP system provides integrated management capabilities across procurement, inventory, finance, human resources, and logistics operations.

## 🚀 Project Structure

The repository contains multiple applications and modules:

### Frontend Applications
- **`bayscom-react-frontend/`** - Main React-based ERP dashboard
- **`bayscom-oil-gas/`** - Next.js application for oil & gas operations

### Backend Applications
- **`bayscom-django-erp/`** - Django-based backend API and admin interface

## 📋 Features

### 🛒 Procurement Module
- **Purchase Orders Management** - Complete PO lifecycle with PDF generation
- **Supplier Management** - Vendor database and relationship management
- **RFQ (Request for Quotation)** - Streamlined quotation process
- **Contract Management** - Contract lifecycle and compliance tracking

### 📦 Inventory Management
- **Assets** - Fixed asset tracking and maintenance scheduling
- **Consumables** - Stock management with reorder levels and alerts
- **Products** - Product inventory with sales velocity tracking

### 💰 Finance Module
- **Financial Overview** - Comprehensive financial dashboard
- **Nigerian VAT (7.5%)** - Compliant with Nigerian tax regulations
- **Naira (₦) Currency** - All transactions in Nigerian Naira

### 👥 Human Resources
- **Employee Management** - Staff records and organizational structure
- **HR Operations** - Leave management, payroll integration

### 🚛 Logistics
- **Supply Chain** - End-to-end logistics management
- **Transportation** - Fleet and delivery tracking

### ⚙️ Administration
- **User Management** - Role-based access control
- **System Configuration** - Customizable system settings
- **Audit Logs** - Complete activity tracking
- **Item Categories** - Master data management

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI) v7** - Modern UI components
- **Next.js 14** - For oil & gas specific applications
- **React Router** - Client-side routing
- **jsPDF** - PDF generation and export

### Backend
- **Django 4.x** - Python web framework
- **Django REST Framework** - API development
- **SQLite** - Development database (production ready for PostgreSQL)

### Development Tools
- **TypeScript** - Type-safe JavaScript
- **ESLint** - Code linting and quality
- **Git** - Version control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Frontend Setup (React)

```bash
cd bayscom-react-frontend
npm install
npm run build
npx serve -s build -p 3000
```

Visit `http://localhost:3000` to access the main ERP dashboard.

### Frontend Setup (Next.js Oil & Gas)

```bash
cd bayscom-oil-gas
npm install
npm run dev
```

Visit `http://localhost:3000` for the oil & gas operations interface.

### Backend Setup (Django)

```bash
cd bayscom-django-erp
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The Django admin will be available at `http://localhost:8000/admin`

## 📱 Key Features

### Nigerian Business Context
- **Currency**: All amounts displayed in Nigerian Naira (₦)
- **VAT**: 7.5% Nigerian VAT included in calculations
- **Compliance**: Built for Nigerian business regulations and practices

### Modern UI/UX
- **Responsive Design** - Mobile and desktop optimized
- **Dark/Light Themes** - User preference support
- **Material Design** - Modern, intuitive interface
- **Real-time Updates** - Live data synchronization

### Business Intelligence
- **Dashboard Analytics** - Key performance indicators
- **Financial Reports** - Comprehensive financial insights
- **Inventory Analytics** - Stock level optimization
- **Sales Velocity** - Product performance tracking

## 🏗️ Module Details

### Inventory Management
The inventory system is organized into three main categories:

1. **Assets** - Fixed assets with maintenance tracking
   - Asset tagging and categorization
   - Maintenance scheduling and alerts
   - Depreciation and valuation tracking

2. **Consumables** - Stock items with consumption tracking
   - Min/max stock levels
   - Automatic reorder alerts
   - Supplier management integration

3. **Products** - Sales inventory with velocity analysis
   - Stock level visualization
   - Reserved vs available stock
   - Profit margin analysis

### Procurement System
- **Single-page Purchase Orders** - Streamlined PO creation
- **PDF Export** - Professional PO documents with Nigerian formatting
- **Supplier Integration** - Comprehensive vendor management
- **Approval Workflows** - Multi-level approval processes

## 🔧 Configuration

### Environment Variables
Create `.env` files in respective directories:

```env
# React Frontend
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_COMPANY_NAME=BAYSCOM Energy Limited

# Django Backend
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
```

## 📄 License

This project is proprietary software developed for BAYSCOM Energy Limited.

## 🤝 Contributing

This is a private enterprise system. For internal development:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For technical support and inquiries:
- **Company**: BAYSCOM Energy Limited
- **Email**: [Company Email]
- **Location**: Nigeria

## 🔒 Security

This system handles sensitive business data. Ensure:
- Regular security updates
- Proper access controls
- Data backup procedures
- Compliance with data protection regulations

---

**Built with ❤️ for BAYSCOM Energy Limited**
