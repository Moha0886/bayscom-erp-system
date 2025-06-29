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
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Pending,
  SupervisorAccount,
  AdminPanelSettings,
  Visibility,
  ThumbUp,
  ThumbDown,
  Comment,
  Schedule,
  Person,
  Assignment,
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

// Mock data for requisitions needing approval
const mockPendingRequisitions: StaffRequisition[] = [
  {
    id: 'REQ004',
    requestDate: '2024-12-23',
    staffName: 'John Okwu',
    staffId: 'EMP004',
    department: 'Engineering',
    supervisor: 'Engr. Kemi Adeoye',
    items: [
      {
        consumableId: 'CON001',
        consumableName: 'A4 Copy Paper',
        requestedQuantity: 20,
        unit: 'Ream',
        justification: 'Technical documentation for Q1 projects',
      },
      {
        consumableId: 'CON008',
        consumableName: 'First Aid Kit',
        requestedQuantity: 3,
        unit: 'Kit',
        justification: 'Replacement for engineering workshop',
      },
    ],
    itemCount: 2,
    purpose: 'Quarterly office supplies and safety equipment',
    urgency: 'medium',
    status: 'supervisor-review',
    expectedDelivery: '2024-12-30',
  },
  {
    id: 'REQ005',
    requestDate: '2024-12-24',
    staffName: 'Amina Hassan',
    staffId: 'EMP005',
    department: 'Operations',
    supervisor: 'Mr. Chike Okafor',
    items: [
      {
        consumableId: 'CON003',
        consumableName: 'Safety Helmets',
        requestedQuantity: 25,
        unit: 'Piece',
        justification: 'New staff onboarding and safety compliance',
      },
      {
        consumableId: 'CON004',
        consumableName: 'Hydraulic Oil',
        requestedQuantity: 100,
        unit: 'Liter',
        justification: 'Monthly maintenance schedule for equipment',
      },
    ],
    itemCount: 2,
    purpose: 'Safety equipment and maintenance supplies',
    urgency: 'high',
    status: 'admin-review',
    supervisorComments: 'Critical safety requirement. Approved with urgency.',
    supervisorDate: '2024-12-24',
    expectedDelivery: '2024-12-28',
  },
  {
    id: 'REQ006',
    requestDate: '2024-12-24',
    staffName: 'David Eze',
    staffId: 'EMP006',
    department: 'IT',
    supervisor: 'Mrs. Sarah Oladele',
    items: [
      {
        consumableId: 'CON005',
        consumableName: 'Printer Cartridges',
        requestedQuantity: 10,
        unit: 'Piece',
        justification: 'IT department monthly printing requirements',
      },
    ],
    itemCount: 1,
    purpose: 'IT department consumables',
    urgency: 'low',
    status: 'pending',
    expectedDelivery: '2025-01-05',
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
      id={`approval-tabpanel-${index}`}
      aria-labelledby={`approval-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RequisitionApproval: React.FC = () => {
  const [requisitions, setRequisitions] = useState<StaffRequisition[]>(mockPendingRequisitions);
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequisition, setSelectedRequisition] = useState<StaffRequisition | null>(null);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');
  const [userRole] = useState<'supervisor' | 'admin'>('supervisor'); // This would come from auth context

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
        activeStep = -1;
        break;
      default:
        activeStep = 0;
    }
    
    return { steps, activeStep };
  };

  const handleApproval = () => {
    if (!selectedRequisition) return;

    const updatedRequisition = { ...selectedRequisition };
    const currentDate = new Date().toISOString().split('T')[0];

    if (userRole === 'supervisor') {
      if (approvalAction === 'approve') {
        updatedRequisition.status = 'admin-review';
        updatedRequisition.supervisorComments = comments || 'Approved by supervisor';
      } else {
        updatedRequisition.status = 'supervisor-rejected';
        updatedRequisition.supervisorComments = comments || 'Rejected by supervisor';
      }
      updatedRequisition.supervisorDate = currentDate;
    } else if (userRole === 'admin') {
      if (approvalAction === 'approve') {
        updatedRequisition.status = 'admin-approved';
        updatedRequisition.adminComments = comments || 'Approved by admin';
      } else {
        updatedRequisition.status = 'admin-rejected';
        updatedRequisition.adminComments = comments || 'Rejected by admin';
      }
      updatedRequisition.adminDate = currentDate;
    }

    setRequisitions(prev => 
      prev.map(req => req.id === selectedRequisition.id ? updatedRequisition : req)
    );

    setOpenApprovalDialog(false);
    setComments('');
    setSelectedRequisition(null);
  };

  const getPendingForRole = () => {
    if (userRole === 'supervisor') {
      return requisitions.filter(req => 
        req.status === 'pending' || req.status === 'supervisor-review'
      );
    } else {
      return requisitions.filter(req => req.status === 'admin-review');
    }
  };

  const getRecentlyProcessed = () => {
    return requisitions.filter(req => 
      req.status.includes('approved') || req.status.includes('rejected')
    ).slice(0, 10);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Requisition Approval Dashboard
        </Typography>
        <Chip
          icon={userRole === 'supervisor' ? <SupervisorAccount /> : <AdminPanelSettings />}
          label={`${userRole === 'supervisor' ? 'Supervisor' : 'Admin'} View`}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Approval
                  </Typography>
                  <Typography variant="h4">
                    {getPendingForRole().length}
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
                    High Priority
                  </Typography>
                  <Typography variant="h4">
                    {getPendingForRole().filter(req => req.urgency === 'high' || req.urgency === 'urgent').length}
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 40, color: '#f44336' }} />
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
                    {getPendingForRole().reduce((sum, req) => sum + req.itemCount, 0)}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: '#2196f3' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`Pending Approval (${getPendingForRole().length})`} />
          <Tab label="Recently Processed" />
          <Tab label="All Requisitions" />
        </Tabs>

        {/* Pending Approval Tab */}
        <TabPanel value={tabValue} index={0}>
          {getPendingForRole().length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No pending requisitions for approval
              </Typography>
            </Box>
          ) : (
            <List>
              {getPendingForRole().map((requisition) => (
                <ListItem
                  key={requisition.id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    mb: 2,
                    bgcolor: requisition.urgency === 'high' || requisition.urgency === 'urgent' ? '#fff3e0' : 'background.paper'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: urgencyColors[requisition.urgency] === 'error' ? '#f44336' : '#2196f3' }}>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="h6">
                          {requisition.id} - {requisition.staffName}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Chip
                            label={requisition.urgency}
                            color={urgencyColors[requisition.urgency]}
                            size="small"
                          />
                          <Chip
                            label={requisition.department}
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={`${requisition.itemCount} items`}
                            color="primary"
                            size="small"
                          />
                        </Stack>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                          {requisition.purpose}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Requested: {new Date(requisition.requestDate).toLocaleDateString()} | 
                          Items: {requisition.items.length} | 
                          Expected: {requisition.expectedDelivery ? new Date(requisition.expectedDelivery).toLocaleDateString() : 'TBD'}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedRequisition(requisition);
                          setOpenApprovalDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<ThumbUp />}
                        onClick={() => {
                          setSelectedRequisition(requisition);
                          setApprovalAction('approve');
                          setOpenApprovalDialog(true);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<ThumbDown />}
                        onClick={() => {
                          setSelectedRequisition(requisition);
                          setApprovalAction('reject');
                          setOpenApprovalDialog(true);
                        }}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Recently Processed Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Req. ID</TableCell>
                  <TableCell>Staff</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Processed Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getRecentlyProcessed().map((requisition) => (
                  <TableRow key={requisition.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{requisition.id}</TableCell>
                    <TableCell>{requisition.staffName}</TableCell>
                    <TableCell>{requisition.department}</TableCell>
                    <TableCell>{requisition.itemCount} item(s)</TableCell>
                    <TableCell>
                      <Chip
                        label={requisition.status.replace('-', ' ')}
                        color={statusColors[requisition.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {requisition.supervisorDate || requisition.adminDate}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedRequisition(requisition);
                          setOpenApprovalDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* All Requisitions Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
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
                {requisitions.map((requisition) => (
                  <TableRow key={requisition.id}>
                    <TableCell sx={{ fontWeight: 'bold' }}>{requisition.id}</TableCell>
                    <TableCell>{new Date(requisition.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{requisition.staffName}</TableCell>
                    <TableCell>{requisition.department}</TableCell>
                    <TableCell>{requisition.itemCount} item(s)</TableCell>
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
                          setOpenApprovalDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Approval Dialog */}
      <Dialog
        open={openApprovalDialog}
        onClose={() => setOpenApprovalDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequisition && (
          <>
            <DialogTitle>
              Requisition {approvalAction === 'approve' ? 'Approval' : 'Rejection'} - {selectedRequisition.id}
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

              {/* Requisition Summary */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 45%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Staff Details</Typography>
                  <Typography variant="body1">{selectedRequisition.staffName}</Typography>
                  <Typography variant="body2" color="textSecondary">{selectedRequisition.staffId}</Typography>
                  <Typography variant="body2">{selectedRequisition.department}</Typography>
                </Box>
                <Box sx={{ flex: '1 1 45%' }}>
                  <Typography variant="subtitle2" color="textSecondary">Request Details</Typography>
                  <Typography variant="body2">Date: {new Date(selectedRequisition.requestDate).toLocaleDateString()}</Typography>
                  <Typography variant="body2">Items: {selectedRequisition.itemCount}</Typography>
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

              {/* Items Summary */}
              <Typography variant="h6" gutterBottom>Requested Items</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table size="small">
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
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Comments */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label={`${approvalAction === 'approve' ? 'Approval' : 'Rejection'} Comments`}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={`Enter your ${approvalAction === 'approve' ? 'approval' : 'rejection'} comments...`}
              />

              {approvalAction === 'approve' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  This requisition will be {userRole === 'supervisor' ? 'forwarded to admin for final approval' : 'approved and processed'}.
                </Alert>
              )}

              {approvalAction === 'reject' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  This requisition will be rejected and returned to the requester.
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenApprovalDialog(false)}>Cancel</Button>
              <Button
                variant="contained"
                color={approvalAction === 'approve' ? 'success' : 'error'}
                onClick={handleApproval}
                startIcon={approvalAction === 'approve' ? <ThumbUp /> : <ThumbDown />}
              >
                {approvalAction === 'approve' ? 'Approve' : 'Reject'} Requisition
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default RequisitionApproval;
