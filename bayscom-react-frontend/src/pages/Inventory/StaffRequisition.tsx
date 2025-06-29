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
  Stack,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Search,
  Download,
  CheckCircle,
  Cancel,
  Pending,
  RequestPage,
  SupervisorAccount,
  AdminPanelSettings,
} from '@mui/icons-material';

interface RequisitionItem {
  consumableId: string;
  consumableName: string;
  requestedQuantity: number;
  unit: string;
  justification: string;
}

interface StaffRequisition {
  id: string;
  requestDate: string;
  staffName: string;
  staffId: string;
  department: string;
  supervisor: string;
  items: RequisitionItem[];
  itemCount: number;
  purpose: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'supervisor-review' | 'supervisor-approved' | 'supervisor-rejected' | 'admin-review' | 'admin-approved' | 'admin-rejected' | 'completed';
  supervisorComments?: string;
  adminComments?: string;
  supervisorDate?: string;
  adminDate?: string;
  expectedDelivery?: string;
}

// Mock data for consumables (for selection)
const availableConsumables = [
  { id: 'CON001', name: 'A4 Copy Paper', unit: 'Ream', stock: 45 },
  { id: 'CON002', name: 'Drill Bits Set', unit: 'Set', stock: 8 },
  { id: 'CON003', name: 'Safety Helmets', unit: 'Piece', stock: 0 },
  { id: 'CON004', name: 'Hydraulic Oil', unit: 'Liter', stock: 185 },
  { id: 'CON005', name: 'Printer Cartridges', unit: 'Piece', stock: 12 },
  { id: 'CON006', name: 'Office Chairs', unit: 'Piece', stock: 6 },
  { id: 'CON007', name: 'Cleaning Supplies', unit: 'Set', stock: 20 },
  { id: 'CON008', name: 'First Aid Kit', unit: 'Kit', stock: 15 },
];

const departments = [
  'Engineering',
  'Operations',
  'Finance',
  'Human Resources',
  'Procurement',
  'Logistics',
  'IT',
  'Quality Assurance',
  'Health & Safety',
  'Administration',
];

const mockRequisitions: StaffRequisition[] = [
  {
    id: 'REQ001',
    requestDate: '2024-12-20',
    staffName: 'Adebayo Johnson',
    staffId: 'EMP001',
    department: 'Engineering',
    supervisor: 'Engr. Kemi Adeoye',
    items: [
      {
        consumableId: 'CON001',
        consumableName: 'A4 Copy Paper',
        requestedQuantity: 10,
        unit: 'Ream',
        justification: 'For project documentation and reports',
      },
      {
        consumableId: 'CON005',
        consumableName: 'Printer Cartridges',
        requestedQuantity: 2,
        unit: 'Piece',
        justification: 'Replacement for office printer',
      },
    ],
    itemCount: 2,
    purpose: 'Monthly office supplies for engineering department',
    urgency: 'medium',
    status: 'supervisor-approved',
    supervisorComments: 'Approved. Reasonable request for monthly operations.',
    supervisorDate: '2024-12-21',
    expectedDelivery: '2024-12-28',
  },
  {
    id: 'REQ002',
    requestDate: '2024-12-22',
    staffName: 'Fatima Ibrahim',
    staffId: 'EMP002',
    department: 'Operations',
    supervisor: 'Mr. Chike Okafor',
    items: [
      {
        consumableId: 'CON003',
        consumableName: 'Safety Helmets',
        requestedQuantity: 15,
        unit: 'Piece',
        justification: 'Replacement for damaged helmets, safety compliance',
      },
    ],
    itemCount: 1,
    purpose: 'Safety equipment replacement',
    urgency: 'high',
    status: 'admin-review',
    supervisorComments: 'Urgent safety requirement. Highly recommended.',
    adminComments: 'Under review for availability.',
    supervisorDate: '2024-12-22',
    expectedDelivery: '2024-12-30',
  },
  {
    id: 'REQ003',
    requestDate: '2024-12-23',
    staffName: 'Samuel Ogundimu',
    staffId: 'EMP003',
    department: 'Logistics',
    supervisor: 'Mrs. Grace Nnamdi',
    items: [
      {
        consumableId: 'CON004',
        consumableName: 'Hydraulic Oil',
        requestedQuantity: 50,
        unit: 'Liter',
        justification: 'Maintenance of hydraulic systems in warehouse',
      },
    ],
    itemCount: 1,
    purpose: 'Preventive maintenance',
    urgency: 'medium',
    status: 'pending',
    expectedDelivery: '2024-12-29',
  },
];

const statusColors = {
  pending: 'default' as const,
  'supervisor-review': 'info' as const,
  'supervisor-approved': 'success' as const,
  'supervisor-rejected': 'error' as const,
  'admin-review': 'warning' as const,
  'admin-approved': 'success' as const,
  'admin-rejected': 'error' as const,
  completed: 'success' as const,
};

const urgencyColors = {
  low: 'default' as const,
  medium: 'info' as const,
  high: 'warning' as const,
  urgent: 'error' as const,
};

const StaffRequisition: React.FC = () => {
  const [requisitions, setRequisitions] = useState<StaffRequisition[]>(mockRequisitions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [openNewRequisition, setOpenNewRequisition] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<StaffRequisition | null>(null);
  
  // New requisition form state
  const [newRequisition, setNewRequisition] = useState({
    staffName: '',
    staffId: '',
    department: '',
    purpose: '',
    urgency: 'medium' as const,
    items: [] as RequisitionItem[],
  });

  const [newItem, setNewItem] = useState({
    consumable: null as any,
    quantity: 1,
    justification: '',
  });

  const getWorkflowSteps = (status: string) => {
    const steps = ['Request Submitted', 'Supervisor Review', 'Admin Approval', 'Completed'];
    let activeStep = 0;
    
    switch (status) {
      case 'pending':
      case 'supervisor-review':
        activeStep = 1;
        break;
      case 'supervisor-approved':
      case 'admin-review':
        activeStep = 2;
        break;
      case 'admin-approved':
      case 'completed':
        activeStep = 3;
        break;
      case 'supervisor-rejected':
      case 'admin-rejected':
        activeStep = -1; // Error state
        break;
      default:
        activeStep = 0;
    }
    
    return { steps, activeStep };
  };

  const handleAddItem = () => {
    if (newItem.consumable && newItem.quantity > 0) {
      const item: RequisitionItem = {
        consumableId: newItem.consumable.id,
        consumableName: newItem.consumable.name,
        requestedQuantity: newItem.quantity,
        unit: newItem.consumable.unit,
        justification: newItem.justification,
      };
      
      setNewRequisition(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      
      setNewItem({
        consumable: null,
        quantity: 1,
        justification: '',
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setNewRequisition(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitRequisition = () => {
    if (newRequisition.staffName && newRequisition.department && newRequisition.items.length > 0) {
      const requisition: StaffRequisition = {
        id: `REQ${String(requisitions.length + 1).padStart(3, '0')}`,
        requestDate: new Date().toISOString().split('T')[0],
        ...newRequisition,
        supervisor: 'To be assigned',
        itemCount: newRequisition.items.length,
        status: 'pending',
        expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      
      setRequisitions(prev => [requisition, ...prev]);
      setOpenNewRequisition(false);
      setNewRequisition({
        staffName: '',
        staffId: '',
        department: '',
        purpose: '',
        urgency: 'medium',
        items: [],
      });
    }
  };

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = req.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || req.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Staff Requisitions
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenNewRequisition(true)}
          sx={{ bgcolor: '#1976d2' }}
        >
          New Requisition
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Requests
                  </Typography>
                  <Typography variant="h4">
                    {requisitions.filter(r => r.status === 'pending' || r.status === 'supervisor-review').length}
                  </Typography>
                </Box>
                <Pending sx={{ fontSize: 40, color: '#ff9800' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Under Review
                  </Typography>
                  <Typography variant="h4">
                    {requisitions.filter(r => r.status === 'admin-review').length}
                  </Typography>
                </Box>
                <SupervisorAccount sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Approved
                  </Typography>
                  <Typography variant="h4">
                    {requisitions.filter(r => r.status.includes('approved')).length}
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Items
                  </Typography>
                  <Typography variant="h4">
                    {requisitions.reduce((sum, r) => sum + r.itemCount, 0)}
                  </Typography>
                </Box>
                <AdminPanelSettings sx={{ fontSize: 40, color: '#9c27b0' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <TextField
            placeholder="Search by staff name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="supervisor-review">Supervisor Review</MenuItem>
            <MenuItem value="admin-review">Admin Review</MenuItem>
            <MenuItem value="supervisor-approved">Supervisor Approved</MenuItem>
            <MenuItem value="admin-approved">Admin Approved</MenuItem>
          </TextField>
          <TextField
            select
            label="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            startIcon={<Download />}
            sx={{ minWidth: 120 }}
          >
            Export
          </Button>
        </Stack>
      </Paper>

      {/* Requisitions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Req. ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Staff</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Urgency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRequisitions.map((requisition) => (
              <TableRow key={requisition.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{requisition.id}</TableCell>
                <TableCell>{new Date(requisition.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {requisition.staffName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {requisition.staffId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{requisition.department}</TableCell>
                <TableCell>{requisition.items.length} item(s)</TableCell>
                <TableCell>
                  <Chip
                    label={requisition.urgency}
                    color={urgencyColors[requisition.urgency]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={requisition.status.replace('-', ' ')}
                    color={statusColors[requisition.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedRequisition(requisition);
                      setOpenViewDialog(true);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Requisition Dialog */}
      <Dialog
        open={openNewRequisition}
        onClose={() => setOpenNewRequisition(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Requisition</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Staff Name"
                value={newRequisition.staffName}
                onChange={(e) => setNewRequisition(prev => ({ ...prev, staffName: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                label="Staff ID"
                value={newRequisition.staffId}
                onChange={(e) => setNewRequisition(prev => ({ ...prev, staffId: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                select
                label="Department"
                value={newRequisition.department}
                onChange={(e) => setNewRequisition(prev => ({ ...prev, department: e.target.value }))}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: '1 1 45%' }}>
              <TextField
                fullWidth
                select
                label="Urgency"
                value={newRequisition.urgency}
                onChange={(e) => setNewRequisition(prev => ({ ...prev, urgency: e.target.value as any }))}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Purpose/Justification"
                value={newRequisition.purpose}
                onChange={(e) => setNewRequisition(prev => ({ ...prev, purpose: e.target.value }))}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Add Items</Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 45%' }}>
              <Autocomplete
                options={availableConsumables}
                getOptionLabel={(option) => `${option.name} (${option.unit})`}
                value={newItem.consumable}
                onChange={(_, value) => setNewItem(prev => ({ ...prev, consumable: value }))}
                renderInput={(params) => <TextField {...params} label="Select Item" />}
              />
            </Box>
            <Box sx={{ flex: '1 1 20%' }}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                inputProps={{ min: 1 }}
              />
            </Box>
            <Box sx={{ flex: '1 1 30%' }}>
              <TextField
                fullWidth
                label="Justification"
                value={newItem.justification}
                onChange={(e) => setNewItem(prev => ({ ...prev, justification: e.target.value }))}
              />
            </Box>
            <Box sx={{ flex: '1 1 100%' }}>
              <Button
                variant="outlined"
                onClick={handleAddItem}
                disabled={!newItem.consumable || newItem.quantity <= 0}
              >
                Add Item
              </Button>
            </Box>
          </Box>

          {/* Items List */}
          {newRequisition.items.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Requested Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Qty</TableCell>
                      <TableCell>Justification</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newRequisition.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.consumableName}</TableCell>
                        <TableCell>{item.requestedQuantity} {item.unit}</TableCell>
                        <TableCell>{item.justification}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleRemoveItem(index)}>
                            <Cancel />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Items:</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {newRequisition.items.length}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewRequisition(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRequisition}
            disabled={!newRequisition.staffName || !newRequisition.department || newRequisition.items.length === 0}
          >
            Submit Requisition
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Requisition Dialog */}
      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequisition && (
          <>
            <DialogTitle>
              Requisition Details - {selectedRequisition.id}
            </DialogTitle>
            <DialogContent>
              {/* Workflow Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Approval Workflow</Typography>
                <Stepper activeStep={getWorkflowSteps(selectedRequisition.status).activeStep}>
                  {getWorkflowSteps(selectedRequisition.status).steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Requisition Info */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 45%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Staff Details</Typography>
                  <Typography variant="body1">{selectedRequisition.staffName}</Typography>
                  <Typography variant="body2" color="textSecondary">{selectedRequisition.staffId}</Typography>
                  <Typography variant="body2">{selectedRequisition.department}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Request Details</Typography>
                  <Typography variant="body2">Date: {new Date(selectedRequisition.requestDate).toLocaleDateString()}</Typography>
                  <Typography variant="body2">Supervisor: {selectedRequisition.supervisor}</Typography>
                  <Chip
                    label={selectedRequisition.urgency}
                    color={urgencyColors[selectedRequisition.urgency]}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box sx={{ flex: '1 1 100%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Purpose</Typography>
                  <Typography variant="body2">{selectedRequisition.purpose}</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Items Table */}
              <Typography variant="h6" gutterBottom>Requested Items</Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Justification</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRequisition.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.consumableName}</TableCell>
                        <TableCell>{item.requestedQuantity} {item.unit}</TableCell>
                        <TableCell>{item.justification}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} sx={{ fontWeight: 'bold' }}>Total Items:</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {selectedRequisition.itemCount}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Comments */}
              {(selectedRequisition.supervisorComments || selectedRequisition.adminComments) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Comments</Typography>
                  {selectedRequisition.supervisorComments && (
                    <Alert severity="info" sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">Supervisor ({selectedRequisition.supervisorDate}):</Typography>
                      <Typography variant="body2">{selectedRequisition.supervisorComments}</Typography>
                    </Alert>
                  )}
                  {selectedRequisition.adminComments && (
                    <Alert severity="warning">
                      <Typography variant="subtitle2">Admin ({selectedRequisition.adminDate}):</Typography>
                      <Typography variant="body2">{selectedRequisition.adminComments}</Typography>
                    </Alert>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
              <Button variant="outlined" startIcon={<Download />}>
                Download PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StaffRequisition;
