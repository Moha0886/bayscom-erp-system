import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import PurchaseOrders from './pages/Procurement/PurchaseOrders';
import Suppliers from './pages/Procurement/Suppliers';
import RFQ from './pages/Procurement/RFQ';
import Contracts from './pages/Procurement/Contracts';
import Assets from './pages/Inventory/Assets';
import Consumables from './pages/Inventory/Consumables';
import Products from './pages/Inventory/Products';
import StaffRequisition from './pages/Inventory/StaffRequisition';
import RequisitionApproval from './pages/Inventory/RequisitionApproval';
import FinanceOverview from './pages/Finance/FinanceOverview';
import HRManagement from './pages/HR/HRManagement';
import Administration from './pages/Admin/Administration';
import UserManagement from './pages/Admin/UserManagement';
import SystemConfiguration from './pages/Admin/SystemConfiguration';
import AuditLogs from './pages/Admin/AuditLogs';
import ItemCategoryManagement from './pages/Admin/ItemCategoryManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/procurement" element={<Navigate to="/procurement/purchase-orders" replace />} />
            <Route path="/procurement/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/procurement/suppliers" element={<Suppliers />} />
            <Route path="/procurement/rfq" element={<RFQ />} />
            <Route path="/procurement/contracts" element={<Contracts />} />
            <Route path="/inventory" element={<Navigate to="/inventory/assets" replace />} />
            <Route path="/inventory/assets" element={<Assets />} />
            <Route path="/inventory/consumables" element={<Consumables />} />
            <Route path="/inventory/products" element={<Products />} />
            <Route path="/inventory/requisitions" element={<StaffRequisition />} />
            <Route path="/inventory/approvals" element={<RequisitionApproval />} />
            <Route path="/finance" element={<FinanceOverview />} />
            <Route path="/hr" element={<HRManagement />} />
            <Route path="/logistics" element={<div>Logistics Module - Coming Soon</div>} />
            <Route path="/reports" element={<div>Reports Module - Coming Soon</div>} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<Administration />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/config" element={<SystemConfiguration />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            <Route path="/admin/item-categories" element={<ItemCategoryManagement />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
