const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 Generating SSL certificates for testing...');

// Create certificates directory
if (!fs.existsSync('certs')) {
  fs.mkdirSync('certs');
}

// Generate private key
console.log('📝 Generating private key...');
execSync('openssl genrsa -out certs/server.key 2048', { stdio: 'inherit' });

// Generate certificate
console.log('📜 Generating certificate...');
execSync('openssl req -new -x509 -key certs/server.key -out certs/server.crt -days 365 -subj "/C=US/ST=Test/L=Test/O=Test/CN=localhost"', { stdio: 'inherit' });

console.log('✅ SSL certificates generated successfully!');
console.log('📁 Certificates saved in ./certs/');
console.log('🔑 Private key: certs/server.key');
console.log('📜 Certificate: certs/server.crt');
