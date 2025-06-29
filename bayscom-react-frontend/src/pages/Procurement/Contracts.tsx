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
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Download,
  FilterList,
  AttachFile,
  Event,
  Business,
  Description,
} from '@mui/icons-material';

interface Contract {
  id: string;
  title: string;
  supplier: string;
  type: 'service' | 'supply' | 'lease' | 'maintenance' | 'consulting';
  startDate: string;
  endDate: string;
  value: number;
  status: 'draft' | 'under_review' | 'active' | 'expired' | 'terminated' | 'completed';
  progress: number;
  department: string;
  renewalOption: boolean;
}

const mockContracts: Contract[] = [
  {
    id: 'CNT-2024-001',
    title: 'Offshore Platform Maintenance Agreement',
    supplier: 'Marine Engineering Solutions',
    type: 'maintenance',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    value: 450000,
    status: 'active',
    progress: 65,
    department: 'Operations',
    renewalOption: true
  },
  {
    id: 'CNT-2024-002',
    title: 'Safety Equipment Supply Contract',
    supplier: 'Safety First Industries',
    type: 'supply',
    startDate: '2024-03-15',
    endDate: '2025-03-14',
    value: 125000,
    status: 'active',
    progress: 40,
    department: 'Safety',
    renewalOption: true
  },
  {
    id: 'CNT-2024-003',
    title: 'IT Infrastructure Consulting',
    supplier: 'TechConsult Pro',
    type: 'consulting',
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    value: 85000,
    status: 'active',
    progress: 85,
    department: 'IT',
    renewalOption: false
  },
  {
    id: 'CNT-2024-004',
    title: 'Transportation Services Agreement',
    supplier: 'Coastal Logistics',
    type: 'service',
    startDate: '2024-06-01',
    endDate: '2026-05-31',
    value: 320000,
    status: 'under_review',
    progress: 0,
    department: 'Logistics',
    renewalOption: true
  },
  {
    id: 'CNT-2023-015',
    title: 'Equipment Lease Agreement',
    supplier: 'Heavy Machinery Rentals',
    type: 'lease',
    startDate: '2023-09-01',
    endDate: '2024-08-31',
    value: 180000,
    status: 'expired',
    progress: 100,
    department: 'Operations',
    renewalOption: true
  },
  {
    id: 'CNT-2024-005',
    title: 'Environmental Monitoring Services',
    supplier: 'EcoWatch Environmental',
    type: 'service',
    startDate: '2024-04-01',
    endDate: '2027-03-31',
    value: 275000,
    status: 'active',
    progress: 25,
    department: 'Environmental',
    renewalOption: true
  },
];

const statusColors = {
  draft: 'default' as const,
  under_review: 'warning' as const,
  active: 'success' as const,
  expired: 'error' as const,
  terminated: 'error' as const,
  completed: 'info' as const,
};

const statusLabels = {
  draft: 'Draft',
  under_review: 'Under Review',
  active: 'Active',
  expired: 'Expired',
  terminated: 'Terminated',
  completed: 'Completed',
};

const typeColors = {
  service: 'primary' as const,
  supply: 'secondary' as const,
  lease: 'info' as const,
  maintenance: 'warning' as const,
  consulting: 'success' as const,
};

export default function Contracts() {
  const [open, setOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleClickOpen = (contract?: Contract) => {
    setSelectedContract(contract || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContract(null);
  };

  const filteredContracts = mockContracts.filter(contract => {
    const statusMatch = !filterStatus || contract.status === filterStatus;
    const typeMatch = !filterType || contract.type === filterType;
    return statusMatch && typeMatch;
  });

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'error';
    if (progress < 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Contract Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleClickOpen()}
          sx={{ borderRadius: 2 }}
        >
          Create New Contract
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Contracts
            </Typography>
            <Typography variant="h4">
              {mockContracts.filter(contract => contract.status === 'active').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Expiring Soon
            </Typography>
            <Typography variant="h4">
              {mockContracts.filter(contract => 
                contract.status === 'active' && getDaysRemaining(contract.endDate) <= 90
              ).length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Under Review
            </Typography>
            <Typography variant="h4">
              {mockContracts.filter(contract => contract.status === 'under_review').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Value
            </Typography>
            <Typography variant="h4">
              ${mockContracts
                .filter(contract => contract.status === 'active')
                .reduce((sum, contract) => sum + contract.value, 0)
                .toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterList />
          <TextField
            select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="under_review">Under Review</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            select
            label="Filter by Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="service">Service</MenuItem>
            <MenuItem value="supply">Supply</MenuItem>
            <MenuItem value="lease">Lease</MenuItem>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="consulting">Consulting</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Contracts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contract ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days Remaining</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Renewal</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContracts.map((contract) => (
              <TableRow key={contract.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {contract.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {contract.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2">
                      {contract.supplier}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}
                    color={typeColors[contract.type]}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{contract.department}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>
                  {contract.status === 'active' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Event fontSize="small" color={getDaysRemaining(contract.endDate) <= 90 ? 'error' : 'action'} />
                      <Typography 
                        variant="body2" 
                        color={getDaysRemaining(contract.endDate) <= 90 ? 'error' : 'textPrimary'}
                      >
                        {getDaysRemaining(contract.endDate)} days
                      </Typography>
                    </Box>
                  )}
                  {contract.status === 'expired' && (
                    <Typography variant="body2" color="error">
                      Expired
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {contract.status === 'active' && (
                    <Box sx={{ width: '100%', minWidth: 100 }}>
                      <LinearProgress
                        variant="determinate"
                        value={contract.progress}
                        color={getProgressColor(contract.progress)}
                        sx={{ mb: 0.5 }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {contract.progress}%
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[contract.status]}
                    color={statusColors[contract.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>${contract.value.toLocaleString()}</TableCell>
                <TableCell>
                  {contract.renewalOption ? (
                    <Chip label="Yes" color="success" size="small" variant="outlined" />
                  ) : (
                    <Chip label="No" color="default" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleClickOpen(contract)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small">
                    <Download />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedContract ? 'Contract Details' : 'Create New Contract'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Contract Title"
              defaultValue={selectedContract?.title || ''}
              variant="outlined"
            />
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="Supplier"
                defaultValue={selectedContract?.supplier || ''}
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 250px' }}
                select
                label="Contract Type"
                defaultValue={selectedContract?.type || ''}
                variant="outlined"
              >
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="supply">Supply</MenuItem>
                <MenuItem value="lease">Lease</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="consulting">Consulting</MenuItem>
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="Department"
                defaultValue={selectedContract?.department || ''}
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="Contract Value"
                defaultValue={selectedContract?.value || ''}
                type="number"
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="Start Date"
                defaultValue={selectedContract?.startDate || ''}
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="End Date"
                defaultValue={selectedContract?.endDate || ''}
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                select
                label="Renewal Option"
                defaultValue={selectedContract?.renewalOption ? 'yes' : 'no'}
                variant="outlined"
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              {selectedContract && (
                <TextField
                  label="Progress (%)"
                  defaultValue={selectedContract.progress}
                  type="number"
                  inputProps={{ min: 0, max: 100 }}
                  variant="outlined"
                  sx={{ minWidth: 150 }}
                />
              )}
            </Box>
            <Box>
              <Button
                variant="outlined"
                startIcon={<AttachFile />}
                sx={{ mr: 2 }}
              >
                Attach Contract Document
              </Button>
              <Typography variant="caption" color="textSecondary">
                Upload signed contract, amendments, or related documents
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!selectedContract && (
            <>
              <Button variant="outlined">Save as Draft</Button>
              <Button variant="contained">Create Contract</Button>
            </>
          )}
          {selectedContract && (
            <Button variant="contained">Update Contract</Button>
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
