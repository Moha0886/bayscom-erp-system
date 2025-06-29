import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from '@mui/material';
import {
  Settings,
  Security,
  Storage,
  Notifications,
  Email,
  Backup,
  Update,
  Speed,
  Monitor,
  ExpandMore,
  Save,
  RestartAlt,
  Download,
  Upload,
  Warning,
  CheckCircle,
  Error,
  Category,
  AccountBalance,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TaxConfiguration {
  id: string;
  name: string;
  description: string;
  percentage: number;
  isActive: boolean;
  isDefault: boolean;
  applicableCategories: string[];
  createdDate: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock tax configurations
const mockTaxConfigurations: TaxConfiguration[] = [
  {
    id: 'tax-001',
    name: 'VAT',
    description: 'Value Added Tax',
    percentage: 7.5,
    isActive: true,
    isDefault: true,
    applicableCategories: ['All'],
    createdDate: '2024-01-15'
  },
  {
    id: 'tax-002',
    name: 'WHT',
    description: 'Withholding Tax',
    percentage: 5.0,
    isActive: true,
    isDefault: false,
    applicableCategories: ['Services'],
    createdDate: '2024-01-15'
  },
  {
    id: 'tax-003',
    name: 'Import Duty',
    description: 'Import duty for international purchases',
    percentage: 10.0,
    isActive: true,
    isDefault: false,
    applicableCategories: ['International'],
    createdDate: '2024-01-15'
  },
  {
    id: 'tax-004',
    name: 'Luxury Tax',
    description: 'Additional tax for luxury items',
    percentage: 15.0,
    isActive: false,
    isDefault: false,
    applicableCategories: ['Luxury Items'],
    createdDate: '2024-01-15'
  }
];

export default function SystemConfiguration() {
  const [tabValue, setTabValue] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [taxes, setTaxes] = useState<TaxConfiguration[]>(mockTaxConfigurations);
  const [taxDialogOpen, setTaxDialogOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxConfiguration | null>(null);
  const [taxForm, setTaxForm] = useState({
    name: '',
    description: '',
    percentage: 0,
    isActive: true,
    isDefault: false,
    applicableCategories: ['All']
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveChanges = () => {
    setUnsavedChanges(false);
    // Handle save logic here
  };

  const handleTaxOpen = (tax?: TaxConfiguration) => {
    if (tax) {
      setSelectedTax(tax);
      setTaxForm({
        name: tax.name,
        description: tax.description,
        percentage: tax.percentage,
        isActive: tax.isActive,
        isDefault: tax.isDefault,
        applicableCategories: tax.applicableCategories
      });
    } else {
      setSelectedTax(null);
      setTaxForm({
        name: '',
        description: '',
        percentage: 0,
        isActive: true,
        isDefault: false,
        applicableCategories: ['All']
      });
    }
    setTaxDialogOpen(true);
  };

  const handleTaxClose = () => {
    setTaxDialogOpen(false);
    setSelectedTax(null);
  };

  const handleSaveTax = () => {
    if (selectedTax) {
      // Update existing tax
      setTaxes(prev => prev.map(tax =>
        tax.id === selectedTax.id
          ? {
              ...tax,
              ...taxForm
            }
          : tax
      ));
    } else {
      // Create new tax
      const newTax: TaxConfiguration = {
        id: `tax-${String(taxes.length + 1).padStart(3, '0')}`,
        ...taxForm,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setTaxes(prev => [...prev, newTax]);
    }
    setUnsavedChanges(true);
    handleTaxClose();
  };

  const handleDeleteTax = (taxId: string) => {
    setTaxes(prev => prev.filter(tax => tax.id !== taxId));
    setUnsavedChanges(true);
  };

  const handleSetDefaultTax = (taxId: string) => {
    setTaxes(prev => prev.map(tax => ({
      ...tax,
      isDefault: tax.id === taxId
    })));
    setUnsavedChanges(true);
  };

  const systemStatus = {
    server: 'healthy',
    database: 'healthy',
    storage: 'warning',
    backup: 'healthy',
    monitoring: 'healthy'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <CheckCircle color="action" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          System Configuration
        </Typography>
        <Stack direction="row" spacing={2}>
          {unsavedChanges && (
            <Alert severity="warning" variant="outlined">
              You have unsaved changes
            </Alert>
          )}
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {}}
          >
            Export Config
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveChanges}
            disabled={!unsavedChanges}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>

      {/* System Status Overview */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="System Status Overview"
          avatar={<Monitor color="primary" />}
        />
        <CardContent>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {Object.entries(systemStatus).map(([component, status]) => (
              <Box key={component} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getStatusIcon(status)}
                <Typography variant="body2">
                  {component.charAt(0).toUpperCase() + component.slice(1)}
                </Typography>
                <Chip
                  label={status}
                  size="small"
                  color={status === 'healthy' ? 'success' : status === 'warning' ? 'warning' : 'error'}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="General Settings" icon={<Settings />} />
          <Tab label="Item Categories" icon={<Category />} />
          <Tab label="Tax Configuration" icon={<AccountBalance />} />
          <Tab label="Security" icon={<Security />} />
          <Tab label="Database" icon={<Storage />} />
          <Tab label="Notifications" icon={<Notifications />} />
          <Tab label="Backup & Recovery" icon={<Backup />} />
          <Tab label="Performance" icon={<Speed />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Company Information" />
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Company Name"
                  defaultValue="BAYSCOM Energy Limited"
                  variant="outlined"
                  onChange={() => setUnsavedChanges(true)}
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Company Address"
                    defaultValue="123 Energy Boulevard, Houston, TX 77001"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Phone Number"
                    defaultValue="+1-713-555-0100"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Email Domain"
                    defaultValue="@bayscom.com"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Website"
                    defaultValue="https://www.bayscom.com"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="System Preferences" />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable Debug Mode"
                />
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Automatic Updates"
                />
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="User Activity Logging"
                />
                <FormControlLabel
                  control={<Switch onChange={() => setUnsavedChanges(true)} />}
                  label="Maintenance Mode"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    select
                    label="Default Language"
                    defaultValue="en"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </TextField>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    select
                    label="Timezone"
                    defaultValue="America/Chicago"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  >
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </TextField>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Item Categories Configuration" />
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="body2" color="textSecondary">
                  Configure item categories for inventory, procurement, and asset management.
                </Typography>
                
                {/* Petroleum Products */}
                <Card variant="outlined">
                  <CardHeader title="Petroleum Products" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">Fuel Types</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="AGO (Automotive Gas Oil)"
                          defaultValue="Diesel Fuel"
                          variant="outlined"
                          helperText="Used for vehicles and generators"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="PMS (Premium Motor Spirit)"
                          defaultValue="Gasoline"
                          variant="outlined"
                          helperText="Petrol for vehicles"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="LPG (Liquefied Petroleum Gas)"
                          defaultValue="Cooking/Heating Gas"
                          variant="outlined"
                          helperText="For domestic and industrial use"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Kerosene"
                          defaultValue="Illuminating Paraffin"
                          variant="outlined"
                          helperText="For lighting and heating"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Office Supplies & Consumables */}
                <Card variant="outlined">
                  <CardHeader title="Office Supplies & Consumables" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">General Supplies</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Tissue Papers"
                          defaultValue="Consumable"
                          variant="outlined"
                          helperText="Office hygiene supplies"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Printer Toner"
                          defaultValue="Consumable"
                          variant="outlined"
                          helperText="Printing supplies"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Stationery"
                          defaultValue="Consumable"
                          variant="outlined"
                          helperText="Pens, papers, folders"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Cleaning Supplies"
                          defaultValue="Consumable"
                          variant="outlined"
                          helperText="Office maintenance"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* IT Assets */}
                <Card variant="outlined">
                  <CardHeader title="IT Assets & Equipment" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">Computer Equipment</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Laptops"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Portable computers"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Desktop Computers"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Workstation computers"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Servers"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Server hardware"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Network Equipment"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Routers, switches, firewalls"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Industrial Equipment */}
                <Card variant="outlined">
                  <CardHeader title="Industrial Equipment & Machinery" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">Oil & Gas Equipment</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Drilling Equipment"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Drilling rigs and tools"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Safety Equipment"
                          defaultValue="Mixed (Asset/Consumable)"
                          variant="outlined"
                          helperText="PPE and safety systems"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Vehicles"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Company vehicles and trucks"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Tools & Instruments"
                          defaultValue="Fixed Asset"
                          variant="outlined"
                          helperText="Measurement and testing tools"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Services */}
                <Card variant="outlined">
                  <CardHeader title="Services Configuration" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography variant="subtitle2">Service Categories</Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Maintenance Services"
                          defaultValue="Service"
                          variant="outlined"
                          helperText="Equipment maintenance and repair"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Consulting Services"
                          defaultValue="Service"
                          variant="outlined"
                          helperText="Professional advisory services"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Transportation Services"
                          defaultValue="Service"
                          variant="outlined"
                          helperText="Logistics and shipping"
                          onChange={() => setUnsavedChanges(true)}
                        />
                        <TextField
                          sx={{ flex: '1 1 200px' }}
                          label="Training Services"
                          defaultValue="Service"
                          variant="outlined"
                          helperText="Employee training and development"
                          onChange={() => setUnsavedChanges(true)}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Category Management */}
                <Card variant="outlined">
                  <CardHeader title="Category Management Settings" />
                  <CardContent>
                    <Stack spacing={2}>
                      <FormControlLabel
                        control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                        label="Auto-categorize items based on keywords"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                        label="Require category approval for new items"
                      />
                      <FormControlLabel
                        control={<Switch onChange={() => setUnsavedChanges(true)} />}
                        label="Allow custom categories"
                      />
                      <TextField
                        fullWidth
                        select
                        label="Default Asset Depreciation Method"
                        defaultValue="straight-line"
                        variant="outlined"
                        onChange={() => setUnsavedChanges(true)}
                      >
                        <option value="straight-line">Straight Line</option>
                        <option value="declining-balance">Declining Balance</option>
                        <option value="units-of-production">Units of Production</option>
                      </TextField>
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Tax Configuration</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleTaxOpen()}
            >
              Add Tax
            </Button>
          </Box>

          <Alert severity="info">
            Configure different tax types and rates that will be applied to purchases and transactions.
          </Alert>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tax Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Rate (%)</TableCell>
                  <TableCell>Applicable Categories</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Default</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {taxes.map((tax) => (
                  <TableRow key={tax.id}>
                    <TableCell sx={{ fontWeight: 'medium' }}>{tax.name}</TableCell>
                    <TableCell>{tax.description}</TableCell>
                    <TableCell>{tax.percentage}%</TableCell>
                    <TableCell>
                      {tax.applicableCategories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={tax.isActive ? 'Active' : 'Inactive'}
                        color={tax.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {tax.isDefault ? (
                        <Chip label="Default" color="primary" size="small" />
                      ) : (
                        <Button
                          size="small"
                          onClick={() => handleSetDefaultTax(tax.id)}
                        >
                          Set Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => handleTaxOpen(tax)}>
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteTax(tax.id)}
                        disabled={tax.isDefault}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Authentication Settings" />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Require Two-Factor Authentication"
                />
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enforce Strong Passwords"
                />
                <FormControlLabel
                  control={<Switch onChange={() => setUnsavedChanges(true)} />}
                  label="Allow Single Sign-On (SSO)"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Session Timeout (minutes)"
                    type="number"
                    defaultValue="30"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Max Login Attempts"
                    type="number"
                    defaultValue="5"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Access Control" />
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Allowed IP Ranges"
                  defaultValue="192.168.1.0/24, 10.0.0.0/8"
                  variant="outlined"
                  helperText="Comma-separated list of IP ranges allowed to access the system"
                  onChange={() => setUnsavedChanges(true)}
                />
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable API Rate Limiting"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="API Rate Limit (requests/hour)"
                    type="number"
                    defaultValue="1000"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Database Configuration" />
            <CardContent>
              <Stack spacing={3}>
                <Alert severity="info">
                  Database configuration changes require system restart to take effect.
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="Database Host"
                    defaultValue="localhost"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 150px' }}
                    label="Port"
                    type="number"
                    defaultValue="5432"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Database Name"
                    defaultValue="bayscom_erp"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Connection Pool Size"
                    type="number"
                    defaultValue="20"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable Query Logging"
                />
                <Button
                  variant="outlined"
                  startIcon={<RestartAlt />}
                  color="warning"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Test Database Connection
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Data Retention Policies" />
            <CardContent>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Log Retention (days)"
                    type="number"
                    defaultValue="90"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Audit Trail Retention (years)"
                    type="number"
                    defaultValue="7"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Auto-Archive Old Records"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Email Notifications" />
            <CardContent>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="SMTP Server"
                    defaultValue="smtp.bayscom.com"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 150px' }}
                    label="Port"
                    type="number"
                    defaultValue="587"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="From Email"
                    defaultValue="noreply@bayscom.com"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 250px' }}
                    label="From Name"
                    defaultValue="BAYSCOM ERP System"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable SSL/TLS"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Notification Preferences" />
            <CardContent>
              <List>
                {[
                  'System Alerts',
                  'User Login Notifications',
                  'Failed Login Attempts',
                  'System Updates',
                  'Backup Completion',
                  'Data Export/Import',
                  'Scheduled Reports'
                ].map((notification) => (
                  <ListItem key={notification}>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText primary={notification} />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked onChange={() => setUnsavedChanges(true)} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Backup Configuration" />
            <CardContent>
              <Stack spacing={3}>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable Automatic Backups"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    select
                    label="Backup Frequency"
                    defaultValue="daily"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </TextField>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Backup Time"
                    type="time"
                    defaultValue="02:00"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <TextField
                  fullWidth
                  label="Backup Storage Location"
                  defaultValue="/var/backups/bayscom-erp"
                  variant="outlined"
                  onChange={() => setUnsavedChanges(true)}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="outlined" startIcon={<Backup />}>
                    Create Manual Backup
                  </Button>
                  <Button variant="outlined" startIcon={<Upload />}>
                    Restore from Backup
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Recent Backups" />
            <CardContent>
              <List>
                {[
                  { name: 'backup_2024-06-27_02-00.sql', size: '2.3 GB', date: '2024-06-27 02:00' },
                  { name: 'backup_2024-06-26_02-00.sql', size: '2.2 GB', date: '2024-06-26 02:00' },
                  { name: 'backup_2024-06-25_02-00.sql', size: '2.1 GB', date: '2024-06-25 02:00' }
                ].map((backup) => (
                  <ListItem key={backup.name}>
                    <ListItemIcon>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText
                      primary={backup.name}
                      secondary={`${backup.size} • ${backup.date}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end">
                        <Download />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={7}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Performance Monitoring" />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable Performance Monitoring"
                />
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Real-time Metrics Collection"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Metrics Retention (days)"
                    type="number"
                    defaultValue="30"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Alert Threshold (CPU %)"
                    type="number"
                    defaultValue="80"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Caching Configuration" />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked onChange={() => setUnsavedChanges(true)} />}
                  label="Enable Application Caching"
                />
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Cache TTL (minutes)"
                    type="number"
                    defaultValue="60"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <TextField
                    sx={{ flex: '1 1 200px' }}
                    label="Max Cache Size (MB)"
                    type="number"
                    defaultValue="512"
                    variant="outlined"
                    onChange={() => setUnsavedChanges(true)}
                  />
                </Box>
                <Button
                  variant="outlined"
                  color="warning"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Clear All Caches
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </TabPanel>

      {/* Tax Configuration Dialog */}
      <Dialog open={taxDialogOpen} onClose={handleTaxClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTax ? 'Edit Tax Configuration' : 'Create New Tax Configuration'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: '1 1 250px' }}
                label="Tax Name"
                value={taxForm.name}
                onChange={(e) => setTaxForm(prev => ({ ...prev, name: e.target.value }))}
                variant="outlined"
                required
                placeholder="e.g., VAT, WHT, Import Duty"
              />
              <TextField
                sx={{ flex: '1 1 200px' }}
                label="Tax Rate (%)"
                type="number"
                value={taxForm.percentage}
                onChange={(e) => setTaxForm(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                variant="outlined"
                required
                inputProps={{ min: 0, max: 100, step: 0.1 }}
              />
            </Box>
            
            <TextField
              fullWidth
              label="Description"
              value={taxForm.description}
              onChange={(e) => setTaxForm(prev => ({ ...prev, description: e.target.value }))}
              multiline
              rows={2}
              variant="outlined"
              placeholder="Description of when this tax applies"
            />
            
            <TextField
              select
              label="Applicable Categories"
              value={taxForm.applicableCategories[0] || 'All'}
              onChange={(e) => setTaxForm(prev => ({ ...prev, applicableCategories: [e.target.value] }))}
              variant="outlined"
              fullWidth
              helperText="Select which item categories this tax applies to"
            >
              <MenuItem value="All">All Categories</MenuItem>
              <MenuItem value="Products">Products</MenuItem>
              <MenuItem value="Services">Services</MenuItem>
              <MenuItem value="Assets">Assets</MenuItem>
              <MenuItem value="Consumables">Consumables</MenuItem>
              <MenuItem value="International">International Purchases</MenuItem>
              <MenuItem value="Luxury Items">Luxury Items</MenuItem>
            </TextField>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={taxForm.isActive}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={taxForm.isDefault}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                }
                label="Set as Default Tax"
              />
            </Box>
            
            {taxForm.isDefault && (
              <Alert severity="info">
                Setting this as the default tax will make it the primary tax used in purchase orders and transactions.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaxClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTax}>
            {selectedTax ? 'Update Tax' : 'Create Tax'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
