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
  Fab,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Alert,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CardHeader,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Send,
  FilterList,
  AttachFile,
  Timer,
  Delete,
  Business,
  Inventory,
  People,
  Email,
  CheckCircle,
} from '@mui/icons-material';

interface RFQItem {
  id: string;
  itemName: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  specifications: string;
  estimatedUnitPrice?: number;
  estimatedTotal?: number;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  rating: number;
  isPrequalified: boolean;
}

interface RFQResponse {
  vendorId: string;
  vendorName: string;
  submittedDate: string;
  totalQuoted: number;
  validityPeriod: string;
  comments: string;
  status: 'pending' | 'submitted' | 'evaluated';
}

interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  description: string;
  dateCreated: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'responses_received' | 'evaluation' | 'closed' | 'awarded';
  items: RFQItem[];
  invitedVendors: string[];
  responses: RFQResponse[];
  estimatedValue: number;
  category: string;
  termsConditions: string;
  evaluationCriteria: string;
  contactPerson: string;
  contactEmail: string;
  awardedTo?: string;
  awardedDate?: string;
}

// Mock vendors with their specialization categories
const mockVendors: Vendor[] = [
  {
    id: 'VEN-001',
    name: 'Energy Solutions Ltd',
    email: 'rfq@energysolutions.com',
    phone: '+234-801-234-5678',
    categories: ['Petroleum Products', 'Industrial Equipment'],
    rating: 4.8,
    isPrequalified: true
  },
  {
    id: 'VEN-002',
    name: 'Industrial Equipment Co',
    email: 'quotes@industrialequip.com',
    phone: '+234-802-345-6789',
    categories: ['Industrial Equipment', 'Safety Equipment'],
    rating: 4.5,
    isPrequalified: true
  },
  {
    id: 'VEN-003',
    name: 'Safety First Ltd',
    email: 'rfq@safetyfirst.com',
    phone: '+234-803-456-7890',
    categories: ['Safety Equipment', 'Office Supplies'],
    rating: 4.7,
    isPrequalified: true
  },
  {
    id: 'VEN-004',
    name: 'TechSupply Nigeria',
    email: 'quotes@techsupply.ng',
    phone: '+234-804-567-8901',
    categories: ['IT Equipment', 'Office Supplies'],
    rating: 4.6,
    isPrequalified: true
  },
  {
    id: 'VEN-005',
    name: 'Marine Logistics Ltd',
    email: 'rfq@marinelogistics.com',
    phone: '+234-805-678-9012',
    categories: ['Marine Services', 'Transportation'],
    rating: 4.4,
    isPrequalified: false
  }
];

// Mock items from our item management system
const mockItems = [
  { name: 'AGO (Automotive Gas Oil)', category: 'Petroleum Products', unit: 'Liters' },
  { name: 'PMS (Premium Motor Spirit)', category: 'Petroleum Products', unit: 'Liters' },
  { name: 'LPG Gas Cylinder', category: 'Petroleum Products', unit: 'Units' },
  { name: 'Industrial Generator', category: 'Industrial Equipment', unit: 'Units' },
  { name: 'Drilling Equipment', category: 'Industrial Equipment', unit: 'Units' },
  { name: 'Safety Helmet', category: 'Safety Equipment', unit: 'Units' },
  { name: 'Safety Harness', category: 'Safety Equipment', unit: 'Units' },
  { name: 'Fire Extinguisher', category: 'Safety Equipment', unit: 'Units' },
  { name: 'Laptop - Dell Latitude', category: 'IT Equipment', unit: 'Units' },
  { name: 'Network Server', category: 'IT Equipment', unit: 'Units' },
  { name: 'Printer Toner', category: 'Office Supplies', unit: 'Units' },
  { name: 'Office Furniture', category: 'Office Supplies', unit: 'Units' }
];

const mockRFQs: RFQ[] = [
  {
    id: '1',
    rfqNumber: 'RFQ-2024-001',
    title: 'Drilling Equipment Supply',
    description: 'Request for quotation for advanced drilling equipment and accessories',
    dateCreated: '2024-06-20',
    dueDate: '2024-07-05',
    status: 'sent',
    estimatedValue: 2750000,
    category: 'Industrial Equipment',
    contactPerson: 'Engineer John Okoro',
    contactEmail: 'j.okoro@bayscom.com',
    termsConditions: 'Payment terms: 30% advance, 70% on delivery. Delivery within 45 days.',
    evaluationCriteria: 'Technical specifications (40%), Price (35%), Delivery time (15%), Vendor experience (10%)',
    items: [
      {
        id: '1',
        itemName: 'Industrial Generator',
        description: '250KVA Diesel Generator with automatic control',
        category: 'Industrial Equipment',
        quantity: 1,
        unit: 'Units',
        specifications: 'Must be Caterpillar or equivalent, with soundproof enclosure',
        estimatedUnitPrice: 2500000,
        estimatedTotal: 2500000
      },
      {
        id: '2',
        itemName: 'Drilling Equipment',
        description: 'Complete drilling kit with accessories',
        category: 'Industrial Equipment',
        quantity: 1,
        unit: 'Units',
        specifications: 'Drilling capacity up to 500m depth, includes bits and tools',
        estimatedUnitPrice: 250000,
        estimatedTotal: 250000
      }
    ],
    invitedVendors: ['VEN-001', 'VEN-002'],
    responses: [
      {
        vendorId: 'VEN-001',
        vendorName: 'Energy Solutions Ltd',
        submittedDate: '2024-06-25',
        totalQuoted: 2650000,
        validityPeriod: '30 days',
        comments: 'Can deliver within 40 days. Installation included.',
        status: 'submitted'
      },
      {
        vendorId: 'VEN-002',
        vendorName: 'Industrial Equipment Co',
        submittedDate: '2024-06-26',
        totalQuoted: 2720000,
        validityPeriod: '45 days',
        comments: 'Premium quality equipment with 2-year warranty.',
        status: 'submitted'
      }
    ]
  },
  {
    id: '2',
    rfqNumber: 'RFQ-2024-002',
    title: 'Safety Equipment Package',
    description: 'Comprehensive safety equipment for offshore operations',
    dateCreated: '2024-06-18',
    dueDate: '2024-07-03',
    status: 'evaluation',
    estimatedValue: 85000,
    category: 'Safety Equipment',
    contactPerson: 'Safety Officer Mary Adebayo',
    contactEmail: 'm.adebayo@bayscom.com',
    termsConditions: 'Payment terms: Net 30 days. All items must be certified.',
    evaluationCriteria: 'Certification compliance (50%), Price (30%), Quality (20%)',
    items: [
      {
        id: '1',
        itemName: 'Safety Helmet',
        description: 'Industrial safety helmets with chin strap',
        category: 'Safety Equipment',
        quantity: 50,
        unit: 'Units',
        specifications: 'Must meet ANSI Z89.1 standards, various sizes',
        estimatedUnitPrice: 500,
        estimatedTotal: 25000
      },
      {
        id: '2',
        itemName: 'Safety Harness',
        description: 'Full body safety harness for height work',
        category: 'Safety Equipment',
        quantity: 20,
        unit: 'Units',
        specifications: 'ANSI Z359.11 compliant, adjustable size',
        estimatedUnitPrice: 1500,
        estimatedTotal: 30000
      },
      {
        id: '3',
        itemName: 'Fire Extinguisher',
        description: 'Dry powder fire extinguisher 9kg',
        category: 'Safety Equipment',
        quantity: 10,
        unit: 'Units',
        specifications: 'Class ABC, 9kg capacity, with wall mount',
        estimatedUnitPrice: 3000,
        estimatedTotal: 30000
      }
    ],
    invitedVendors: ['VEN-002', 'VEN-003'],
    responses: [
      {
        vendorId: 'VEN-002',
        vendorName: 'Industrial Equipment Co',
        submittedDate: '2024-06-28',
        totalQuoted: 82000,
        validityPeriod: '60 days',
        comments: 'All items are certified and in stock.',
        status: 'submitted'
      },
      {
        vendorId: 'VEN-003',
        vendorName: 'Safety First Ltd',
        submittedDate: '2024-06-29',
        totalQuoted: 78000,
        validityPeriod: '45 days',
        comments: 'Premium quality with extended warranty.',
        status: 'submitted'
      }
    ]
  }
];

const statusColors = {
  draft: 'default' as const,
  sent: 'info' as const,
  responses_received: 'warning' as const,
  evaluation: 'primary' as const,
  closed: 'success' as const,
  awarded: 'success' as const,
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent to Vendors',
  responses_received: 'Responses Received',
  evaluation: 'Under Evaluation',
  closed: 'Closed',
  awarded: 'Awarded',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rfq-tabpanel-${index}`}
      aria-labelledby={`rfq-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RFQManagement() {
  const [open, setOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // RFQ form state
  const [rfqItems, setRfqItems] = useState<RFQItem[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [rfqFormData, setRfqFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    termsConditions: '',
    evaluationCriteria: '',
    contactPerson: '',
    contactEmail: ''
  });

  const handleClickOpen = (rfq?: RFQ) => {
    if (rfq) {
      setSelectedRFQ(rfq);
      setRfqItems(rfq.items);
      setSelectedVendors(rfq.invitedVendors);
      setRfqFormData({
        title: rfq.title,
        description: rfq.description,
        dueDate: rfq.dueDate,
        termsConditions: rfq.termsConditions,
        evaluationCriteria: rfq.evaluationCriteria,
        contactPerson: rfq.contactPerson,
        contactEmail: rfq.contactEmail
      });
    } else {
      setSelectedRFQ(null);
      setRfqItems([]);
      setSelectedVendors([]);
      setRfqFormData({
        title: '',
        description: '',
        dueDate: '',
        termsConditions: '',
        evaluationCriteria: '',
        contactPerson: '',
        contactEmail: ''
      });
    }
    setActiveTab(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRFQ(null);
    setActiveTab(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const addItem = () => {
    const newItem: RFQItem = {
      id: Date.now().toString(),
      itemName: '',
      description: '',
      category: '',
      quantity: 1,
      unit: 'Units',
      specifications: '',
      estimatedUnitPrice: 0,
      estimatedTotal: 0
    };
    setRfqItems([...rfqItems, newItem]);
  };

  const updateItem = (index: number, field: keyof RFQItem, value: any) => {
    const updatedItems = [...rfqItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate total when quantity or unit price changes
    if (field === 'quantity' || field === 'estimatedUnitPrice') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity;
      const unitPrice = field === 'estimatedUnitPrice' ? value : updatedItems[index].estimatedUnitPrice || 0;
      updatedItems[index].estimatedTotal = quantity * unitPrice;
    }
    
    setRfqItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setRfqItems(rfqItems.filter((_, i) => i !== index));
  };

  const getItemCategories = () => {
    const categories = new Set(rfqItems.map(item => item.category).filter(cat => cat));
    return Array.from(categories);
  };

  const getEligibleVendors = () => {
    const itemCategories = getItemCategories();
    if (itemCategories.length === 0) return mockVendors;
    
    return mockVendors.filter(vendor => 
      itemCategories.some(category => vendor.categories.includes(category))
    );
  };

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const calculateEstimatedValue = () => {
    return rfqItems.reduce((sum, item) => sum + (item.estimatedTotal || 0), 0);
  };

  const filteredRFQs = filterStatus 
    ? mockRFQs.filter(rfq => rfq.status === filterStatus)
    : mockRFQs;

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Request for Quotations (RFQ)
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleClickOpen()}
          sx={{ borderRadius: 2 }}
        >
          Create New RFQ
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active RFQs
            </Typography>
            <Typography variant="h4">
              {mockRFQs.filter(rfq => ['sent', 'responses_received', 'evaluation'].includes(rfq.status)).length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Draft RFQs
            </Typography>
            <Typography variant="h4">
              {mockRFQs.filter(rfq => rfq.status === 'draft').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Awaiting Responses
            </Typography>
            <Typography variant="h4">
              {mockRFQs.filter(rfq => rfq.status === 'sent').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h4">
              ${mockRFQs.reduce((sum, rfq) => sum + rfq.estimatedValue, 0).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterList />
          <TextField
            select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="responses_received">Responses Received</MenuItem>
            <MenuItem value="evaluation">Under Evaluation</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* RFQ Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RFQ ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Days Remaining</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Suppliers</TableCell>
              <TableCell>Responses</TableCell>
              <TableCell>Estimated Value</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRFQs.map((rfq) => (
              <TableRow key={rfq.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {rfq.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {rfq.title}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {rfq.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={rfq.category} variant="outlined" size="small" />
                </TableCell>
                <TableCell>{rfq.dateCreated}</TableCell>
                <TableCell>{rfq.dueDate}</TableCell>
                <TableCell>
                  {rfq.status !== 'closed' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Timer fontSize="small" color={getDaysRemaining(rfq.dueDate) <= 3 ? 'error' : 'action'} />
                      <Typography 
                        variant="body2" 
                        color={getDaysRemaining(rfq.dueDate) <= 3 ? 'error' : 'textPrimary'}
                      >
                        {getDaysRemaining(rfq.dueDate)} days
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[rfq.status]}
                    color={statusColors[rfq.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{rfq.invitedVendors.length}</TableCell>
                <TableCell>
                  {rfq.responses.length}/{rfq.invitedVendors.length}
                </TableCell>
                <TableCell>${rfq.estimatedValue.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleClickOpen(rfq)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  {rfq.status === 'draft' && (
                    <IconButton size="small" color="primary">
                      <Send />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedRFQ ? `RFQ Details - ${selectedRFQ.rfqNumber}` : 'Create New RFQ'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={handleTabChange} aria-label="RFQ tabs">
                <Tab label="Basic Information" />
                <Tab label="Items" />
                <Tab label="Vendor Selection" />
                <Tab label="Terms & Evaluation" />
                {selectedRFQ && (
                  <Tab label="Responses" />
                )}
              </Tabs>
            </Box>

            {/* Tab 1: Basic Information */}
            <TabPanel value={activeTab} index={0}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="RFQ Title"
                  value={rfqFormData.title}
                  onChange={(e) => setRfqFormData(prev => ({ ...prev, title: e.target.value }))}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={rfqFormData.description}
                  onChange={(e) => setRfqFormData(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={3}
                  variant="outlined"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Due Date"
                    value={rfqFormData.dueDate}
                    onChange={(e) => setRfqFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                  />
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Contact Person"
                    value={rfqFormData.contactPerson}
                    onChange={(e) => setRfqFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    variant="outlined"
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Contact Email"
                  value={rfqFormData.contactEmail}
                  onChange={(e) => setRfqFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  type="email"
                  variant="outlined"
                />
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<AttachFile />}
                    sx={{ mr: 2 }}
                  >
                    Attach Documents
                  </Button>
                  <Typography variant="caption" color="textSecondary">
                    Upload specifications, drawings, or other relevant documents
                  </Typography>
                </Box>
              </Stack>
            </TabPanel>

            {/* Tab 2: Items */}
            <TabPanel value={activeTab} index={1}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">RFQ Items</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addItem}
                  >
                    Add Item
                  </Button>
                </Box>

                {rfqItems.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Inventory sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Items Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Add items to this RFQ to get vendor quotes
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={addItem}
                    >
                      Add First Item
                    </Button>
                  </Paper>
                ) : (
                  <Box>
                    {rfqItems.map((item, index) => (
                      <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6">Item {index + 1}</Typography>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => removeItem(index)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ flex: '1 1 300px' }}>
                              <Autocomplete
                                options={mockItems.map(item => item.name)}
                                value={item.itemName}
                                onChange={(event, newValue) => updateItem(index, 'itemName', newValue || '')}
                                onInputChange={(event, newInputValue) => {
                                  updateItem(index, 'itemName', newInputValue);
                                  // Auto-populate category and unit based on selected item
                                  const selectedItem = mockItems.find(mockItem => mockItem.name === newInputValue);
                                  if (selectedItem) {
                                    updateItem(index, 'category', selectedItem.category);
                                    updateItem(index, 'unit', selectedItem.unit);
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Item Name"
                                    fullWidth
                                  />
                                )}
                              />
                            </Box>
                            <Box sx={{ flex: '1 1 300px' }}>
                              <TextField
                                fullWidth
                                label="Category"
                                value={item.category}
                                onChange={(e) => updateItem(index, 'category', e.target.value)}
                                select
                              >
                                {Array.from(new Set(mockItems.map(item => item.category))).map(category => (
                                  <MenuItem key={category} value={category}>
                                    {category}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Box>
                          </Box>
                          <TextField
                            fullWidth
                            label="Description"
                            value={item.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            multiline
                            rows={2}
                          />
                          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ flex: '1 1 150px' }}>
                              <TextField
                                fullWidth
                                label="Quantity"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                type="number"
                              />
                            </Box>
                            <Box sx={{ flex: '1 1 150px' }}>
                              <TextField
                                fullWidth
                                label="Unit"
                                value={item.unit}
                                onChange={(e) => updateItem(index, 'unit', e.target.value)}
                              />
                            </Box>
                            <Box sx={{ flex: '1 1 150px' }}>
                              <TextField
                                fullWidth
                                label="Est. Unit Price ($)"
                                value={item.estimatedUnitPrice || ''}
                                onChange={(e) => updateItem(index, 'estimatedUnitPrice', parseFloat(e.target.value) || 0)}
                                type="number"
                              />
                            </Box>
                            <Box sx={{ flex: '1 1 150px' }}>
                              <TextField
                                fullWidth
                                label="Est. Total ($)"
                                value={item.estimatedTotal || 0}
                                InputProps={{ readOnly: true }}
                                variant="filled"
                              />
                            </Box>
                          </Box>
                          <TextField
                            fullWidth
                            label="Specifications"
                            value={item.specifications}
                            onChange={(e) => updateItem(index, 'specifications', e.target.value)}
                            multiline
                            rows={2}
                            placeholder="Enter detailed specifications, quality requirements, standards, etc."
                          />
                        </Box>
                      </Paper>
                    ))}
                    
                    {/* Summary */}
                    <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                          Total Items: {rfqItems.length}
                        </Typography>
                        <Typography variant="h6">
                          Estimated Value: ${calculateEstimatedValue().toLocaleString()}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 3: Vendor Selection */}
            <TabPanel value={activeTab} index={2}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Vendor Selection
                  </Typography>
                  {getItemCategories().length > 0 && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Vendors shown are qualified for the categories: {getItemCategories().join(', ')}
                    </Alert>
                  )}
                </Box>

                {getEligibleVendors().length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Business sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Eligible Vendors
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add items to see vendors qualified for those categories
                    </Typography>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {getEligibleVendors().map((vendor) => (
                      <Box key={vendor.id} sx={{ flex: '1 1 300px', minWidth: 300 }}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedVendors.includes(vendor.id) ? 2 : 1,
                            borderColor: selectedVendors.includes(vendor.id) ? 'primary.main' : 'divider',
                            height: '100%'
                          }}
                          onClick={() => toggleVendorSelection(vendor.id)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6">
                                {vendor.name}
                              </Typography>
                              <Checkbox
                                checked={selectedVendors.includes(vendor.id)}
                                onChange={() => toggleVendorSelection(vendor.id)}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {vendor.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {vendor.phone}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                              {vendor.categories.map((category) => (
                                <Chip
                                  key={category}
                                  label={category}
                                  size="small"
                                  color={getItemCategories().includes(category) ? 'primary' : 'default'}
                                  variant={getItemCategories().includes(category) ? 'filled' : 'outlined'}
                                />
                              ))}
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2">
                                  Rating: {vendor.rating}/5
                                </Typography>
                                {vendor.isPrequalified && (
                                  <Chip label="Prequalified" color="success" size="small" />
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                )}

                {selectedVendors.length > 0 && (
                  <Paper sx={{ p: 2, bgcolor: 'success.light' }}>
                    <Typography variant="h6" gutterBottom>
                      Selected Vendors ({selectedVendors.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedVendors.map(vendorId => {
                        const vendor = mockVendors.find(v => v.id === vendorId);
                        return vendor ? (
                          <Chip
                            key={vendorId}
                            label={vendor.name}
                            onDelete={() => toggleVendorSelection(vendorId)}
                            color="primary"
                          />
                        ) : null;
                      })}
                    </Box>
                  </Paper>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 4: Terms & Evaluation */}
            <TabPanel value={activeTab} index={3}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Terms & Conditions"
                  value={rfqFormData.termsConditions}
                  onChange={(e) => setRfqFormData(prev => ({ ...prev, termsConditions: e.target.value }))}
                  multiline
                  rows={4}
                  placeholder="Enter payment terms, delivery requirements, warranty conditions, etc."
                />
                <TextField
                  fullWidth
                  label="Evaluation Criteria"
                  value={rfqFormData.evaluationCriteria}
                  onChange={(e) => setRfqFormData(prev => ({ ...prev, evaluationCriteria: e.target.value }))}
                  multiline
                  rows={4}
                  placeholder="Specify how quotations will be evaluated (e.g., price weight, technical specifications, delivery time, etc.)"
                />
                
                {rfqItems.length > 0 && selectedVendors.length > 0 && (
                  <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
                    <Typography variant="h6" gutterBottom>
                      RFQ Summary
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Typography variant="body2">
                            <strong>Total Items:</strong> {rfqItems.length}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Categories:</strong> {getItemCategories().join(', ') || 'None'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Estimated Value:</strong> ${calculateEstimatedValue().toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ flex: '1 1 300px' }}>
                          <Typography variant="body2">
                            <strong>Vendors Invited:</strong> {selectedVendors.length}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Due Date:</strong> {rfqFormData.dueDate || 'Not set'}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Contact:</strong> {rfqFormData.contactPerson || 'Not set'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )}
              </Stack>
            </TabPanel>

            {/* Tab 5: Responses (only for existing RFQs) */}
            {selectedRFQ && (
              <TabPanel value={activeTab} index={4}>
                <Stack spacing={3}>
                  <Typography variant="h6">
                    Vendor Responses ({selectedRFQ.responses.length}/{selectedRFQ.invitedVendors.length})
                  </Typography>
                  
                  {selectedRFQ.responses.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                      <Email sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No Responses Received
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vendors have not submitted their quotations yet
                      </Typography>
                    </Paper>
                  ) : (
                    selectedRFQ.responses.map((response) => (
                      <Card key={response.vendorId}>
                        <CardHeader
                          title={response.vendorName}
                          subheader={`Submitted: ${response.submittedDate}`}
                          action={
                            <Chip
                              label={response.status}
                              color={response.status === 'submitted' ? 'success' : 'default'}
                            />
                          }
                        />
                        <CardContent>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <Box sx={{ flex: '1 1 200px' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Total Quoted
                                </Typography>
                                <Typography variant="h6">
                                  ${response.totalQuoted.toLocaleString()}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 200px' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Validity Period
                                </Typography>
                                <Typography variant="body1">
                                  {response.validityPeriod}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: '1 1 200px' }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<Visibility />}
                                  fullWidth
                                >
                                  View Details
                                </Button>
                              </Box>
                            </Box>
                            {response.comments && (
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  Comments
                                </Typography>
                                <Typography variant="body1">
                                  {response.comments}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </TabPanel>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!selectedRFQ && (
            <>
              <Button variant="outlined">Save as Draft</Button>
              <Button 
                variant="contained"
                disabled={rfqItems.length === 0 || selectedVendors.length === 0}
              >
                Create & Send RFQ
              </Button>
            </>
          )}
          {selectedRFQ && selectedRFQ.status === 'draft' && (
            <Button 
              variant="contained" 
              startIcon={<Send />}
              disabled={rfqItems.length === 0 || selectedVendors.length === 0}
            >
              Send RFQ
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleClickOpen()}
      >
        <Add />
      </Fab>
    </Box>
  );
}
