import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Divider,
  Autocomplete,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Add,
  Edit,
  Visibility,
  Download,
  FilterList,
  Delete,
  LocalShipping,
  Receipt,
  Business,
  DateRange,
} from '@mui/icons-material';

// TypeScript declaration for jsPDF autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PurchaseOrderItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  totalPrice: number;
  category: string;
}

interface DeliveryDetails {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  contactPerson: string;
  contactPhone: string;
  deliveryDate: string;
  deliveryMethod: 'pickup' | 'delivery' | 'shipping';
  specialInstructions: string;
}

interface TermsConditions {
  paymentTerms: string;
  deliveryTerms: string;
  warrantyPeriod: string;
  penaltyClause: string;
  returnPolicy: string;
  additionalTerms: string;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  supplierEmail: string;
  supplierPhone: string;
  date: string;
  expectedDelivery: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  deliveryDetails: DeliveryDetails;
  termsConditions: TermsConditions;
  notes: string;
  approvedBy?: string;
  approvedDate?: string;
}

// Mock data
const mockSuppliers = [
  { name: 'Energy Solutions Ltd', email: 'orders@energysolutions.com', phone: '+234-801-234-5678' },
  { name: 'Industrial Equipment Co', email: 'sales@industrialequip.com', phone: '+234-802-345-6789' },
  { name: 'Safety First Ltd', email: 'orders@safetyfirst.com', phone: '+234-803-456-7890' },
  { name: 'TechSupply Nigeria', email: 'sales@techsupply.ng', phone: '+234-804-567-8901' },
  { name: 'Marine Logistics Ltd', email: 'orders@marinelogistics.com', phone: '+234-805-678-9012' }
];

const mockItems = [
  { name: 'AGO (Automotive Gas Oil)', category: 'Petroleum Products', unit: 'Liters', unitPrice: 800 },
  { name: 'PMS (Premium Motor Spirit)', category: 'Petroleum Products', unit: 'Liters', unitPrice: 750 },
  { name: 'Industrial Generator', category: 'Industrial Equipment', unit: 'Units', unitPrice: 2500000 },
  { name: 'Safety Helmet', category: 'Safety Equipment', unit: 'Units', unitPrice: 15000 },
  { name: 'Fire Extinguisher', category: 'Safety Equipment', unit: 'Units', unitPrice: 25000 },
  { name: 'Laptop - Dell Latitude', category: 'IT Equipment', unit: 'Units', unitPrice: 850000 }
];

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    supplier: 'Energy Solutions Ltd',
    supplierEmail: 'orders@energysolutions.com',
    supplierPhone: '+234-801-234-5678',
    date: '2024-06-20',
    expectedDelivery: '2024-07-15',
    status: 'approved',
    subtotal: 2500000,
    tax: 125000,
    discount: 0,
    total: 2625000,
    items: [
      {
        id: '1',
        itemName: 'Industrial Generator',
        description: '250KVA Diesel Generator with automatic control',
        quantity: 1,
        unitPrice: 2500000,
        unit: 'Units',
        totalPrice: 2500000,
        category: 'Industrial Equipment'
      }
    ],
    deliveryDetails: {
      address: '123 Industrial Area, Ikeja',
      city: 'Lagos',
      state: 'Lagos',
      postalCode: '100001',
      contactPerson: 'John Doe',
      contactPhone: '+234-901-234-5678',
      deliveryDate: '2024-07-15',
      deliveryMethod: 'delivery',
      specialInstructions: 'Handle with care. Installation required.'
    },
    termsConditions: {
      paymentTerms: 'Net 30 days',
      deliveryTerms: 'FOB Destination',
      warrantyPeriod: '12 months',
      penaltyClause: '1% per day for late delivery',
      returnPolicy: '30 days return policy for defective items',
      additionalTerms: 'Installation and commissioning included'
    },
    notes: 'High priority order for new facility setup',
    approvedBy: 'Manager John Smith',
    approvedDate: '2024-06-22'
  }
];

const statusColors = {
  draft: 'default' as const,
  pending: 'warning' as const,
  approved: 'success' as const,
  rejected: 'error' as const,
  completed: 'success' as const,
  cancelled: 'error' as const,
};

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');

  // Form state
  const [poForm, setPOForm] = useState<Partial<PurchaseOrder>>({
    poNumber: '',
    supplier: '',
    supplierEmail: '',
    supplierPhone: '',
    date: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    status: 'draft',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
    deliveryDetails: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      contactPerson: '',
      contactPhone: '',
      deliveryDate: '',
      deliveryMethod: 'delivery',
      specialInstructions: ''
    },
    termsConditions: {
      paymentTerms: 'Net 30 days',
      deliveryTerms: 'FOB Destination',
      warrantyPeriod: '',
      penaltyClause: '',
      returnPolicy: '',
      additionalTerms: ''
    }
  });

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setViewMode('create');
    setPOForm({
      poNumber: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      supplier: '',
      supplierEmail: '',
      supplierPhone: '',
      date: new Date().toISOString().split('T')[0],
      expectedDelivery: '',
      status: 'draft',
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      notes: '',
      deliveryDetails: {
        address: '',
        city: '',
        state: '',
        postalCode: '',
        contactPerson: '',
        contactPhone: '',
        deliveryDate: '',
        deliveryMethod: 'delivery',
        specialInstructions: ''
      },
      termsConditions: {
        paymentTerms: 'Net 30 days',
        deliveryTerms: 'FOB Destination',
        warrantyPeriod: '',
        penaltyClause: '',
        returnPolicy: '',
        additionalTerms: ''
      }
    });
    setOpenDialog(true);
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewMode('edit');
    setPOForm(order);
    setOpenDialog(true);
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setViewMode('view');
    setPOForm(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleSupplierChange = (supplier: string) => {
    const supplierData = mockSuppliers.find(s => s.name === supplier);
    setPOForm(prev => ({
      ...prev,
      supplier,
      supplierEmail: supplierData?.email || '',
      supplierPhone: supplierData?.phone || ''
    }));
  };

  const handleAddItem = () => {
    const newItem: PurchaseOrderItem = {
      id: String(Date.now()),
      itemName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'Units',
      totalPrice: 0,
      category: ''
    };
    setPOForm(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setPOForm(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId) || []
    }));
    calculateTotals();
  };

  const handleItemChange = (itemId: string, field: keyof PurchaseOrderItem, value: any) => {
    setPOForm(prev => ({
      ...prev,
      items: prev.items?.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      }) || []
    }));
    setTimeout(calculateTotals, 100);
  };

  const handleItemSelect = (itemId: string, selectedItem: string) => {
    const item = mockItems.find(i => i.name === selectedItem);
    if (item) {
      handleItemChange(itemId, 'itemName', item.name);
      handleItemChange(itemId, 'unitPrice', item.unitPrice);
      handleItemChange(itemId, 'unit', item.unit);
      handleItemChange(itemId, 'category', item.category);
    }
  };

  const calculateTotals = () => {
    const subtotal = poForm.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    const taxRate = 0.075; // 7.5% Nigerian VAT
    const tax = subtotal * taxRate;
    const total = subtotal + tax - (poForm.discount || 0);
    
    setPOForm(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  };

  const handleDownloadPO = () => {
    const po = poForm;
    const doc = new jsPDF();

    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(40, 116, 166);
    doc.text('BAYSCOM ENERGY LIMITED', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Oil & Gas Services Company', 20, 38);
    doc.text('Lagos, Nigeria', 20, 44);
    doc.text('Email: info@bayscom.ng | Phone: +234-xxx-xxx-xxxx', 20, 50);

    // Purchase Order Title
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('PURCHASE ORDER', 20, 70);

    // PO Details Box
    doc.setDrawColor(40, 116, 166);
    doc.setLineWidth(0.5);
    doc.rect(140, 20, 65, 40);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PO Number:', 145, 30);
    doc.setFont('helvetica', 'normal');
    doc.text(po.poNumber || 'N/A', 145, 38);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 145, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(po.date ? new Date(po.date).toLocaleDateString() : 'N/A', 145, 56);

    // Status Badge
    doc.setFillColor(76, 175, 80);
    if (po.status === 'pending') doc.setFillColor(255, 152, 0);
    if (po.status === 'draft') doc.setFillColor(158, 158, 158);
    if (po.status === 'rejected') doc.setFillColor(244, 67, 54);
    
    doc.roundedRect(140, 65, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(po.status?.toUpperCase() || 'DRAFT', 142, 70);
    doc.setTextColor(0, 0, 0);

    // Supplier Information
    let yPos = 90;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPPLIER INFORMATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${po.supplier || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Email: ${po.supplierEmail || 'N/A'}`, 20, yPos);
    yPos += 6;
    doc.text(`Phone: ${po.supplierPhone || 'N/A'}`, 20, yPos);

    // Delivery Information
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DELIVERY INFORMATION', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (po.deliveryDetails) {
      doc.text(`Address: ${po.deliveryDetails.address || 'N/A'}`, 20, yPos);
      yPos += 6;
      doc.text(`City: ${po.deliveryDetails.city || 'N/A'}, ${po.deliveryDetails.state || 'N/A'} ${po.deliveryDetails.postalCode || ''}`, 20, yPos);
      yPos += 6;
      doc.text(`Contact: ${po.deliveryDetails.contactPerson || 'N/A'} (${po.deliveryDetails.contactPhone || 'N/A'})`, 20, yPos);
      yPos += 6;
      doc.text(`Delivery Date: ${po.deliveryDetails.deliveryDate ? new Date(po.deliveryDetails.deliveryDate).toLocaleDateString() : 'N/A'}`, 20, yPos);
      yPos += 6;
      doc.text(`Method: ${po.deliveryDetails.deliveryMethod || 'N/A'}`, 20, yPos);
    }

    // Items Table
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ITEMS', 20, yPos);

    const tableData = po.items?.map((item, index) => [
      index + 1,
      item.itemName || 'N/A',
      item.description || 'N/A',
      `${item.quantity || 0} ${item.unit || ''}`,
      `₦${(item.unitPrice || 0).toLocaleString()}`,
      `₦${(item.totalPrice || 0).toLocaleString()}`
    ]) || [];

    autoTable(doc, {
      startY: yPos + 5,
      head: [['#', 'Item Name', 'Description', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [40, 116, 166],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 60 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });

    // Financial Summary
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;
    yPos = finalY + 20;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(130, yPos - 5, 65, 35);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FINANCIAL SUMMARY', 135, yPos + 3);
    
    // Add currency note
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('(All amounts in Nigerian Naira - ₦)', 135, yPos + 10);
    doc.setTextColor(0, 0, 0);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', 135, yPos);
    doc.text(`₦${(po.subtotal || 0).toLocaleString()}`, 180, yPos);

    yPos += 6;
    doc.text('VAT (7.5%):', 135, yPos);
    doc.text(`₦${(po.tax || 0).toLocaleString()}`, 180, yPos);

    yPos += 6;
    doc.text('Discount:', 135, yPos);
    doc.text(`₦${(po.discount || 0).toLocaleString()}`, 180, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 135, yPos);
    doc.text(`₦${(po.total || 0).toLocaleString()}`, 180, yPos);

    // Terms & Conditions
    yPos += 20;
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS', 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (po.termsConditions) {
      doc.text(`Payment Terms: ${po.termsConditions.paymentTerms || 'N/A'}`, 20, yPos);
      yPos += 6;
      doc.text(`Delivery Terms: ${po.termsConditions.deliveryTerms || 'N/A'}`, 20, yPos);
      yPos += 6;
      doc.text(`Warranty: ${po.termsConditions.warrantyPeriod || 'N/A'}`, 20, yPos);
      yPos += 6;
      
      if (po.termsConditions.penaltyClause) {
        doc.text('Penalty Clause:', 20, yPos);
        yPos += 6;
        const penaltyLines = doc.splitTextToSize(po.termsConditions.penaltyClause, 170);
        doc.text(penaltyLines, 20, yPos);
        yPos += penaltyLines.length * 6;
      }
    }

    // Notes
    if (po.notes) {
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('NOTES:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(po.notes, 170);
      doc.text(notesLines, 20, yPos);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by BAYSCOM ERP System', 20, 285);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 292);
      doc.text(`Page ${i} of ${pageCount}`, 180, 292);
    }

    // Save the PDF
    const fileName = `PO_${po.poNumber || 'New'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleSavePO = () => {
    if (viewMode === 'create') {
      const newPO: PurchaseOrder = {
        ...poForm as PurchaseOrder,
        id: String(orders.length + 1)
      };
      setOrders([...orders, newPO]);
    } else if (viewMode === 'edit' && selectedOrder) {
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...poForm as PurchaseOrder } : order
      ));
    }
    setOpenDialog(false);
  };

  const getDialogTitle = () => {
    switch (viewMode) {
      case 'create': return 'Create New Purchase Order';
      case 'edit': return `Edit Purchase Order - ${poForm.poNumber}`;
      case 'view': return `View Purchase Order - ${poForm.poNumber}`;
      default: return 'Purchase Order';
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Purchase Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOrder}
          size="large"
        >
          Create Purchase Order
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
            <Typography variant="h4">{orders.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Pending Approval</Typography>
            <Typography variant="h4">{orders.filter(o => o.status === 'pending').length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px' }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Value</Typography>
            <Typography variant="h4">₦{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Orders</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
        <Button variant="outlined" startIcon={<FilterList />}>
          More Filters
        </Button>
      </Stack>

      {/* Purchase Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{order.poNumber}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>{new Date(order.expectedDelivery).toLocaleDateString()}</TableCell>
                <TableCell>₦{order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status.toUpperCase()}
                    color={statusColors[order.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleViewOrder(order)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEditOrder(order)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => {
                    setPOForm(order);
                    handleDownloadPO();
                  }}>
                    <Download />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Single Page View Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {getDialogTitle()}
              <Chip 
                label={poForm.status?.toUpperCase()} 
                color={statusColors[poForm.status as keyof typeof statusColors]} 
                size="small" 
              />
            </Box>
            {viewMode === 'view' && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadPO}
                  size="small"
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setViewMode('edit')}
                  size="small"
                >
                  Edit PO
                </Button>
              </Box>
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={4}>
            
            {/* Header Information */}
            <Paper sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h5" gutterBottom>
                Purchase Order #{poForm.poNumber || 'New PO'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2">Date Created</Typography>
                  <Typography variant="body1">{poForm.date ? new Date(poForm.date).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Expected Delivery</Typography>
                  <Typography variant="body1">{poForm.expectedDelivery ? new Date(poForm.expectedDelivery).toLocaleDateString() : 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Total Amount</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ₦{(poForm.total || 0).toLocaleString()}
                  </Typography>
                </Box>
                {poForm.approvedBy && (
                  <Box>
                    <Typography variant="subtitle2">Approved By</Typography>
                    <Typography variant="body1">{poForm.approvedBy}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* General Information */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business /> General Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="PO Number"
                  value={poForm.poNumber || ''}
                  onChange={(e) => setPOForm(prev => ({ ...prev, poNumber: e.target.value }))}
                  variant="outlined"
                  disabled={viewMode === 'view'}
                  required
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Date"
                  type="date"
                  value={poForm.date || ''}
                  onChange={(e) => setPOForm(prev => ({ ...prev, date: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  disabled={viewMode === 'view'}
                  required
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Expected Delivery"
                  type="date"
                  value={poForm.expectedDelivery || ''}
                  onChange={(e) => setPOForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  disabled={viewMode === 'view'}
                />
              </Box>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
                Supplier Information
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Autocomplete
                  sx={{ flex: '1 1 300px' }}
                  options={mockSuppliers.map(s => s.name)}
                  value={poForm.supplier || ''}
                  onChange={(event, newValue) => handleSupplierChange(newValue || '')}
                  disabled={viewMode === 'view'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supplier"
                      required
                    />
                  )}
                />
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="Supplier Email"
                  value={poForm.supplierEmail || ''}
                  onChange={(e) => setPOForm(prev => ({ ...prev, supplierEmail: e.target.value }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Supplier Phone"
                  value={poForm.supplierPhone || ''}
                  onChange={(e) => setPOForm(prev => ({ ...prev, supplierPhone: e.target.value }))}
                  disabled={viewMode === 'view'}
                />
              </Box>
            </Paper>

            {/* Items Section */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt /> Purchase Order Items
                </Typography>
                {viewMode !== 'view' && (
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddItem}
                    size="small"
                  >
                    Add Item
                  </Button>
                )}
              </Box>
              <Divider sx={{ mb: 3 }} />

              {poForm.items && poForm.items.length > 0 ? (
                <Box>
                  {poForm.items.map((item, index) => (
                    <Paper key={item.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Item #{index + 1}
                        </Typography>
                        {viewMode !== 'view' && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <Autocomplete
                          sx={{ flex: '1 1 250px' }}
                          options={mockItems.map(item => item.name)}
                          value={item.itemName}
                          onChange={(event, newValue) => handleItemSelect(item.id, newValue || '')}
                          disabled={viewMode === 'view'}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Item Name"
                              required
                            />
                          )}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Category"
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          disabled={viewMode === 'view'}
                        />
                      </Box>
                      
                      <TextField
                        fullWidth
                        label="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        multiline
                        rows={2}
                        disabled={viewMode === 'view'}
                        sx={{ mb: 2 }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 100px' }}
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          disabled={viewMode === 'view'}
                        />
                        <TextField
                          sx={{ flex: '1 1 100px' }}
                          label="Unit"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          disabled={viewMode === 'view'}
                        />
                        <TextField
                          sx={{ flex: '1 1 150px' }}
                          label="Unit Price (₦)"
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          disabled={viewMode === 'view'}
                        />
                        <TextField
                          sx={{ flex: '1 1 150px' }}
                          label="Total Price (₦)"
                          value={item.totalPrice.toLocaleString()}
                          InputProps={{ readOnly: true }}
                          variant="filled"
                        />
                      </Box>
                    </Paper>
                  ))}
                  
                  <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box>
                        <Typography variant="subtitle2">Total Items: {poForm.items.length}</Typography>
                        <Typography variant="body2">
                          Total Quantity: {poForm.items.reduce((sum, item) => sum + item.quantity, 0)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2">Subtotal: ₦{(poForm.subtotal || 0).toLocaleString()}</Typography>
                        <Typography variant="subtitle2">VAT (7.5%): ₦{(poForm.tax || 0).toLocaleString()}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          Total: ₦{(poForm.total || 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Receipt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Items Added
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add items to create your purchase order
                  </Typography>
                  {viewMode !== 'view' && (
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddItem}
                    >
                      Add First Item
                    </Button>
                  )}
                </Box>
              )}
            </Paper>

            {/* Delivery Details */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping /> Delivery Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                  sx={{ flex: '1 1 300px' }}
                  label="Delivery Address"
                  value={poForm.deliveryDetails?.address || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, address: e.target.value }
                  }))}
                  multiline
                  rows={2}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="City"
                  value={poForm.deliveryDetails?.city || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, city: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 150px' }}
                  label="State"
                  value={poForm.deliveryDetails?.state || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, state: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 150px' }}
                  label="Postal Code"
                  value={poForm.deliveryDetails?.postalCode || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, postalCode: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Contact Person"
                  value={poForm.deliveryDetails?.contactPerson || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, contactPerson: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Contact Phone"
                  value={poForm.deliveryDetails?.contactPhone || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, contactPhone: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Delivery Date"
                  type="date"
                  value={poForm.deliveryDetails?.deliveryDate || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, deliveryDate: e.target.value }
                  }))}
                  InputLabelProps={{ shrink: true }}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  select
                  label="Delivery Method"
                  value={poForm.deliveryDetails?.deliveryMethod || 'delivery'}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    deliveryDetails: { ...prev.deliveryDetails!, deliveryMethod: e.target.value as any }
                  }))}
                  disabled={viewMode === 'view'}
                >
                  <MenuItem value="pickup">Pickup</MenuItem>
                  <MenuItem value="delivery">Delivery</MenuItem>
                  <MenuItem value="shipping">Shipping</MenuItem>
                </TextField>
              </Box>
              
              <TextField
                fullWidth
                label="Special Instructions"
                value={poForm.deliveryDetails?.specialInstructions || ''}
                onChange={(e) => setPOForm(prev => ({
                  ...prev,
                  deliveryDetails: { ...prev.deliveryDetails!, specialInstructions: e.target.value }
                }))}
                multiline
                rows={2}
                disabled={viewMode === 'view'}
              />
            </Paper>

            {/* Terms & Conditions */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DateRange /> Terms & Conditions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Payment Terms"
                  value={poForm.termsConditions?.paymentTerms || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    termsConditions: { ...prev.termsConditions!, paymentTerms: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Delivery Terms"
                  value={poForm.termsConditions?.deliveryTerms || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    termsConditions: { ...prev.termsConditions!, deliveryTerms: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 200px' }}
                  label="Warranty Period"
                  value={poForm.termsConditions?.warrantyPeriod || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    termsConditions: { ...prev.termsConditions!, warrantyPeriod: e.target.value }
                  }))}
                  disabled={viewMode === 'view'}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <TextField
                  sx={{ flex: '1 1 300px' }}
                  label="Penalty Clause"
                  value={poForm.termsConditions?.penaltyClause || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    termsConditions: { ...prev.termsConditions!, penaltyClause: e.target.value }
                  }))}
                  multiline
                  rows={2}
                  disabled={viewMode === 'view'}
                />
                <TextField
                  sx={{ flex: '1 1 300px' }}
                  label="Return Policy"
                  value={poForm.termsConditions?.returnPolicy || ''}
                  onChange={(e) => setPOForm(prev => ({
                    ...prev,
                    termsConditions: { ...prev.termsConditions!, returnPolicy: e.target.value }
                  }))}
                  multiline
                  rows={2}
                  disabled={viewMode === 'view'}
                />
              </Box>
              
              <TextField
                fullWidth
                label="Additional Terms"
                value={poForm.termsConditions?.additionalTerms || ''}
                onChange={(e) => setPOForm(prev => ({
                  ...prev,
                  termsConditions: { ...prev.termsConditions!, additionalTerms: e.target.value }
                }))}
                multiline
                rows={3}
                disabled={viewMode === 'view'}
              />
            </Paper>

            {/* Notes */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Additional Notes
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <TextField
                fullWidth
                label="Notes"
                value={poForm.notes || ''}
                onChange={(e) => setPOForm(prev => ({ ...prev, notes: e.target.value }))}
                multiline
                rows={3}
                disabled={viewMode === 'view'}
                placeholder="Add any additional notes or comments..."
              />
            </Paper>

          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={handleCloseDialog}>
            {viewMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {viewMode !== 'view' && (
            <>
              <Button variant="outlined" onClick={() => setPOForm(prev => ({ ...prev, status: 'draft' }))}>
                Save as Draft
              </Button>
              <Button variant="contained" onClick={handleSavePO}>
                {viewMode === 'create' ? 'Create Purchase Order' : 'Update Purchase Order'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
