// Test script to verify admin services can be imported
try {
  const adminServices = require('./services/admin');
  console.log('✓ Admin services imported successfully');
  console.log('Available services:', Object.keys(adminServices));

  // Test that each service is an object
  for (const [key, service] of Object.entries(adminServices)) {
    if (typeof service !== 'object' || service === null) {
      throw new Error(`Service ${key} is not a valid object`);
    }
    console.log(`✓ Service ${key}:`, typeof service);
  }

  console.log('✓ All admin services are valid objects');
  process.exit(0);
} catch (error) {
  console.error('✗ Error importing admin services:', error.message);
  process.exit(1);
}