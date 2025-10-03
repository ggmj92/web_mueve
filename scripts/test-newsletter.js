#!/usr/bin/env node

/**
 * Test script for newsletter functionality
 * Run with: node scripts/test-newsletter.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
const subscribersFile = path.join(dataDir, 'subscribers.json');

function checkSubscribers() {
  console.log('📧 Newsletter Subscribers Test\n');
  
  if (!fs.existsSync(subscribersFile)) {
    console.log('❌ No subscribers file found at:', subscribersFile);
    console.log('   This is normal if no one has subscribed yet.');
    console.log('   Try subscribing through the website first!\n');
    return;
  }

  try {
    const data = fs.readFileSync(subscribersFile, 'utf8');
    const subscribers = JSON.parse(data);
    
    console.log(`✅ Found ${subscribers.length} subscriber(s):\n`);
    
    subscribers.forEach((subscriber, index) => {
      console.log(`${index + 1}. ${subscriber.email}`);
      console.log(`   Subscribed: ${new Date(subscriber.subscribedAt).toLocaleString()}`);
      console.log(`   Source: ${subscriber.source}\n`);
    });
    
    // Check for duplicates
    const emails = subscribers.map(s => s.email);
    const uniqueEmails = [...new Set(emails)];
    
    if (emails.length !== uniqueEmails.length) {
      console.log('⚠️  Warning: Duplicate emails found!');
    } else {
      console.log('✅ No duplicate emails found');
    }
    
  } catch (error) {
    console.error('❌ Error reading subscribers file:', error.message);
  }
}

function checkEnvironment() {
  console.log('🔧 Environment Check\n');
  
  const envFile = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envFile)) {
    console.log('❌ .env.local file not found');
    console.log('   Copy .env.example to .env.local and configure your settings\n');
    return;
  }
  
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  if (envContent.includes('your_mailerlite_api_key_here')) {
    console.log('⚠️  MailerLite API key not configured (using local storage)');
  } else {
    console.log('✅ MailerLite API key appears to be configured');
  }
  
  if (envContent.includes('ENABLE_LOCAL_EMAIL_STORAGE=true')) {
    console.log('✅ Local email storage is enabled');
  } else {
    console.log('⚠️  Local email storage is disabled');
  }
  
  console.log('');
}

function showInstructions() {
  console.log('🚀 How to Test Newsletter Functionality:\n');
  
  console.log('1. Start your development server:');
  console.log('   npm run dev\n');
  
  console.log('2. Open your browser and go to:');
  console.log('   http://localhost:3000\n');
  
  console.log('3. Wait for the newsletter modal to appear (or clear localStorage):');
  console.log('   - Open browser dev tools');
  console.log('   - Go to Application > Local Storage');
  console.log('   - Delete "newsletter-modal-dismissed" key');
  console.log('   - Refresh the page\n');
  
  console.log('4. Test the subscription form:');
  console.log('   - Enter a valid email address');
  console.log('   - Click "Suscribirse"');
  console.log('   - Check for success/error messages\n');
  
  console.log('5. View collected emails:');
  console.log('   http://localhost:3000/admin/subscribers\n');
  
  console.log('6. Run this test script again to see results:');
  console.log('   node scripts/test-newsletter.js\n');
}

// Main execution
console.log('🧪 Newsletter Functionality Test\n');
console.log('================================\n');

checkEnvironment();
checkSubscribers();
showInstructions();
