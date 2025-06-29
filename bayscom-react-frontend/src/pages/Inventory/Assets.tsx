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
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  QrCode,
  LocationOn,
  CalendarToday,
  Build,
  Assignment,
} from '@mui/icons-material';

interface Asset {
  id: string;
  name: string;
  assetTag: string;
  category: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  location: string;
  assignedTo: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'out-of-service';
  maintenanceSchedule: string;
  lastMaintenance: string;
  nextMaintenance: string;
  warranty: string;
  status: 'active' | 'inactive' | 'disposed' | 'maintenance';
}

const mockAssets: Asset[] = [
  {
    id: 'AST-001',
    name: 'Industrial Generator 500KVA',
    assetTag: 'GEN-500-001',
    category: 'Power Equipment',
    serialNumber: 'CAT-GEN-500-2024',
    model: 'C15 ACERT',
    manufacturer: 'Caterpillar',
    purchaseDate: '2024-01-15',
    purchasePrice: 15000000,
    currentValue: 14000000,
    location: 'Main Facility - Generator Room',
    assignedTo: 'Operations Team',
    condition: 'excellent',
    maintenanceSchedule: 'Monthly',
    lastMaintenance: '2024-05-15',
    nextMaintenance: '2024-07-15',
    warranty: '2 years - Valid until Jan 2026',
    status: 'active'
  },
  {
    id: 'AST-002',
    name: 'Drilling Equipment Set',
    assetTag: 'DRL-001',
    category: 'Drilling Equipment',
    serialNumber: 'BJ-DRL-2023-045',
    model: 'Baker Hughes Model X',
    manufacturer: 'Baker Hughes',
    purchaseDate: '2023-08-20',
    purchasePrice: 45000000,
    currentValue: 40000000,
    location: 'Field Site Alpha',
    assignedTo: 'Drilling Team Alpha',
    condition: 'good',
    maintenanceSchedule: 'Bi-weekly',
    lastMaintenance: '2024-06-01',
    nextMaintenance: '2024-07-01',
    warranty: '3 years - Valid until Aug 2026',
    status: 'active'
  },
  {
    id: 'AST-003',
    name: 'Heavy Duty Crane 50T',
    assetTag: 'CRN-50T-001',
    category: 'Heavy Machinery',
    serialNumber: 'LBH-50T-2024-012',
    model: 'LTM 1050-3.1',
    manufacturer: 'Liebherr',
    purchaseDate: '2024-03-10',
    purchasePrice: 35000000,
    currentValue: 33000000,
    location: 'Construction Yard',
    assignedTo: 'Construction Team',
    condition: 'excellent',
    maintenanceSchedule: 'Weekly',
    lastMaintenance: '2024-06-20',
    nextMaintenance: '2024-06-27',
    warranty: '5 years - Valid until Mar 2029',
    status: 'active'
  },
  {
    id: 'AST-004',
    name: 'Safety Monitoring System',
    assetTag: 'SMS-001',
    category: 'Safety Equipment',
    serialNumber: 'HON-SMS-2024-001',
    model: 'SafeGuard Pro X1',
    manufacturer: 'Honeywell',
    purchaseDate: '2024-02-05',
    purchasePrice: 8500000,
    currentValue: 8000000,
    location: 'Control Room',
    assignedTo: 'Safety Team',
    condition: 'excellent',
    maintenanceSchedule: 'Quarterly',
    lastMaintenance: '2024-04-01',
    nextMaintenance: '2024-07-01',
    warranty: '3 years - Valid until Feb 2027',
    status: 'active'
  }
];

const conditionColors = {
  excellent: 'success' as const,
  good: 'primary' as const,
  fair: 'warning' as const,
  poor: 'error' as const,
  'out-of-service': 'default' as const,
};

const statusColors = {
  active: 'success' as const,
  inactive: 'default' as const,
  disposed: 'error' as const,
  maintenance: 'warning' as const,
};

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<'create' | 'edit' | 'view'>('create');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const categories = ['Power Equipment', 'Drilling Equipment', 'Heavy Machinery', 'Safety Equipment', 'IT Equipment'];

  const handleCreateAsset = () => {
    setSelectedAsset(null);
    setViewMode('create');
    setOpenDialog(true);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('view');
    setOpenDialog(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('edit');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAsset(null);
  };

  const getDialogTitle = () => {
    switch (viewMode) {
      case 'create': return 'Register New Asset';
      case 'edit': return `Edit Asset - ${selectedAsset?.assetTag}`;
      case 'view': return `Asset Details - ${selectedAsset?.assetTag}`;
      default: return 'Asset Management';
    }
  };

  const filteredAssets = assets.filter(asset => {
    const categoryMatch = filterCategory === 'all' || asset.category === filterCategory;
    const statusMatch = filterStatus === 'all' || asset.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const activeAssets = assets.filter(asset => asset.status === 'active').length;
  const maintenanceDue = assets.filter(asset => new Date(asset.nextMaintenance) <= new Date()).length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Asset Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateAsset}
          size="large"
        >
          Register Asset
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box 
        display="grid" 
        gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} 
        gap={3} 
        sx={{ mb: 3 }}
      >
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Assets</Typography>
            <Typography variant="h4">{assets.length}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Active Assets</Typography>
            <Typography variant="h4" color="success.main">{activeAssets}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Total Asset Value</Typography>
            <Typography variant="h5">₦{totalValue.toLocaleString()}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>Maintenance Due</Typography>
            <Typography variant="h4" color="warning.main">{maintenanceDue}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Maintenance Due Alert */}
      {maintenanceDue > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {maintenanceDue} asset(s) have maintenance due or overdue. Please schedule maintenance activities.
        </Alert>
      )}

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {categories.map(category => (
            <MenuItem key={category} value={category}>{category}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="maintenance">Under Maintenance</MenuItem>
          <MenuItem value="disposed">Disposed</MenuItem>
        </TextField>
      </Stack>

      {/* Assets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Tag</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Condition</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Value</TableCell>
              <TableCell>Next Maintenance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssets.map((asset) => (
              <TableRow key={asset.id} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{asset.assetTag}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.assignedTo}</TableCell>
                <TableCell>
                  <Chip
                    label={asset.condition.replace('-', ' ').toUpperCase()}
                    color={conditionColors[asset.condition]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={asset.status.toUpperCase()}
                    color={statusColors[asset.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>₦{asset.currentValue.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color={new Date(asset.nextMaintenance) <= new Date() ? 'error' : 'text.primary'}
                  >
                    {new Date(asset.nextMaintenance).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleViewAsset(asset)} title="View Details">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleEditAsset(asset)} title="Edit Asset">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" title="Generate QR Code">
                    <QrCode />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Asset Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{getDialogTitle()}</DialogTitle>
        <DialogContent>
          {selectedAsset && viewMode === 'view' && (
            <Stack spacing={3}>
              {/* Basic Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment /> Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Asset Tag</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.assetTag}</Typography>
                    
                    <Typography variant="subtitle2">Asset Name</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.name}</Typography>
                    
                    <Typography variant="subtitle2">Category</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.category}</Typography>
                    
                    <Typography variant="subtitle2">Serial Number</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.serialNumber}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Manufacturer</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.manufacturer}</Typography>
                    
                    <Typography variant="subtitle2">Model</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.model}</Typography>
                    
                    <Typography variant="subtitle2">Purchase Date</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedAsset.purchaseDate).toLocaleDateString()}
                    </Typography>
                    
                    <Typography variant="subtitle2">Warranty</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.warranty}</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Location & Assignment */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn /> Location & Assignment
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Current Location</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.location}</Typography>
                    
                    <Typography variant="subtitle2">Assigned To</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.assignedTo}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Condition</Typography>
                    <Chip
                      label={selectedAsset.condition.replace('-', ' ').toUpperCase()}
                      color={conditionColors[selectedAsset.condition]}
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography variant="subtitle2" sx={{ display: 'block', mt: 2 }}>Status</Typography>
                    <Chip
                      label={selectedAsset.status.toUpperCase()}
                      color={statusColors[selectedAsset.status]}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Financial Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Financial Information</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Purchase Price</Typography>
                    <Typography variant="h6" color="primary">
                      ₦{selectedAsset.purchasePrice.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Current Value</Typography>
                    <Typography variant="h6" color="success.main">
                      ₦{selectedAsset.currentValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Maintenance Information */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Build /> Maintenance Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
                  <Box>
                    <Typography variant="subtitle2">Maintenance Schedule</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{selectedAsset.maintenanceSchedule}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Last Maintenance</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {new Date(selectedAsset.lastMaintenance).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Next Maintenance</Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ mb: 2 }}
                      color={new Date(selectedAsset.nextMaintenance) <= new Date() ? 'error' : 'text.primary'}
                    >
                      {new Date(selectedAsset.nextMaintenance).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {viewMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {viewMode === 'view' && (
            <Button variant="contained" onClick={() => setViewMode('edit')}>
              Edit Asset
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
