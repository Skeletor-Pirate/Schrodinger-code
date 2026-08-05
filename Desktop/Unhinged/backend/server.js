const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { userManagementService, workspaceManagementService, auditLogService, pluginManagementService, agentManagementService, groupManagementService, complianceService, vaultSyncWorker, conflictResolutionService, pluginSecurityService } = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'unhinged-backend'
  });
});

// API routes
app.use('/api/users', userManagementService);
app.use('/api/workspaces', workspaceManagementService);
app.use('/api/audit', auditLogService);
app.use('/api/plugins', pluginManagementService);
app.use('/api/agents', agentManagementService);
app.use('/api/groups', groupManagementService);
app.use('/api/compliance', complianceService);
app.use('/api/vault-sync', vaultSyncWorker);
app.use('/api/conflict-resolution', conflictResolutionService);
app.use('/api/plugin-security', pluginSecurityService);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'UNHINGED Backend API',
    version: '1.0.0',
    endpoints: [
      '/health',
      '/api/users',
      '/api/workspaces',
      '/api/audit',
      '/api/plugins',
      '/api/agents',
      '/api/groups',
      '/api/compliance',
      '/api/vault-sync',
      '/api/conflict-resolution',
      '/api/plugin-security'
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

module.exports = app;