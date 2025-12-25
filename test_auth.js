// Authentication Flow Test Script
// This script tests the authentication system functionality

const testResults = {
    tests: [],
    passed: 0,
    failed: 0
};

function addTest(testName, result, message) {
    testResults.tests.push({
        name: testName,
        result: result,
        message: message,
        timestamp: new Date().toISOString()
    });
    
    if (result) {
        testResults.passed++;
        console.log(`✅ PASS: ${testName}`);
    } else {
        testResults.failed++;
        console.log(`❌ FAIL: ${testName} - ${message}`);
    }
}

// Test the auth.js module functionality
function testAuthModule() {
    console.log('🧪 Testing Authentication Module...\n');
    
    // Test 1: Check if Auth object exists and has required methods
    if (typeof Auth !== 'undefined') {
        const requiredMethods = ['login', 'logout', 'signup', 'isLoggedIn', 'getCurrentUser', 'getUserRole', 'redirectAfterLogin', 'requireAuth'];
        const missingMethods = requiredMethods.filter(method => typeof Auth[method] !== 'function');
        
        if (missingMethods.length === 0) {
            addTest('Auth object has all required methods', true, 'All authentication methods present');
        } else {
            addTest('Auth object has all required methods', false, `Missing methods: ${missingMethods.join(', ')}`);
        }
    } else {
        addTest('Auth object exists', false, 'Auth object not found - auth.js may not be loaded');
    }
    
    // Test 2: Test demo users
    if (typeof demoUsers !== 'undefined' && Array.isArray(demoUsers)) {
        const expectedUsers = ['buyer123', 'seller123', 'admin123'];
        const foundUsers = demoUsers.map(u => u.username);
        const missingUsers = expectedUsers.filter(u => !foundUsers.includes(u));
        
        if (missingUsers.length === 0) {
            addTest('All demo users present', true, 'buyer123, seller123, admin123 found');
        } else {
            addTest('All demo users present', false, `Missing users: ${missingUsers.join(', ')}`);
        }
        
        // Test user roles
        const roles = demoUsers.map(u => u.role);
        if (roles.includes('buyer') && roles.includes('seller') && roles.includes('admin')) {
            addTest('Demo users have correct roles', true, 'buyer, seller, admin roles present');
        } else {
            addTest('Demo users have correct roles', false, 'Missing required roles');
        }
    } else {
        addTest('Demo users array exists', false, 'demoUsers not found or not an array');
    }
}

// Test login functionality
function testLoginFunctionality() {
    console.log('\n🔐 Testing Login Functionality...\n');
    
    if (typeof Auth !== 'undefined' && typeof Auth.login === 'function') {
        // Test valid login credentials
        const buyerLogin = Auth.login('buyer@example.com', 'buyer123');
        if (buyerLogin.success && buyerLogin.role === 'buyer') {
            addTest('Buyer login works', true, 'Successfully logged in as buyer');
        } else {
            addTest('Buyer login works', false, `Login failed or wrong role: ${JSON.stringify(buyerLogin)}`);
        }
        
        // Test invalid login
        const invalidLogin = Auth.login('invalid@example.com', 'wrongpassword');
        if (!invalidLogin.success) {
            addTest('Invalid login rejected', true, 'Invalid credentials properly rejected');
        } else {
            addTest('Invalid login rejected', false, 'Invalid login was accepted');
        }
        
        // Test username login
        const usernameLogin = Auth.login('seller123', 'seller123');
        if (usernameLogin.success && usernameLogin.role === 'seller') {
            addTest('Username login works', true, 'Successfully logged in with username');
        } else {
            addTest('Username login works', false, 'Username login failed');
        }
    } else {
        addTest('Login function exists', false, 'Auth.login function not available');
    }
}

// Test signup functionality
function testSignupFunctionality() {
    console.log('\n📝 Testing Signup Functionality...\n');
    
    if (typeof Auth !== 'undefined' && typeof Auth.signup === 'function') {
        const testUser = {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'testpass123',
            phone: '+27123456789',
            role: 'buyer'
        };
        
        const signupResult = Auth.signup(testUser);
        if (signupResult.success) {
            addTest('Signup functionality works', true, 'New user created successfully');
        } else {
            addTest('Signup functionality works', false, `Signup failed: ${signupResult.message}`);
        }
    } else {
        addTest('Signup function exists', false, 'Auth.signup function not available');
    }
}

// Test session management
function testSessionManagement() {
    console.log('\n💾 Testing Session Management...\n');
    
    // Test localStorage and sessionStorage
    const testData = { test: 'value', timestamp: Date.now() };
    sessionStorage.setItem('pulsebuy_test', JSON.stringify(testData));
    const retrieved = JSON.parse(sessionStorage.getItem('pulsebuy_test') || '{}');
    
    if (JSON.stringify(testData) === JSON.stringify(retrieved)) {
        addTest('Session storage works', true, 'Data stored and retrieved correctly');
    } else {
        addTest('Session storage works', false, 'Session storage failed');
    }
    
    // Test user data structure
    if (typeof Auth !== 'undefined' && typeof Auth.getCurrentUser === 'function') {
        const currentUser = Auth.getCurrentUser();
        if (currentUser && currentUser.id && currentUser.email && currentUser.role) {
            addTest('User data structure valid', true, 'User object has required fields');
        } else {
            addTest('User data structure valid', false, 'User object missing required fields');
        }
    } else {
        addTest('getCurrentUser function exists', false, 'Auth.getCurrentUser not available');
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Authentication Flow Tests...\n');
    console.log('=' .repeat(50));
    
    testAuthModule();
    testLoginFunctionality();
    testSignupFunctionality();
    testSessionManagement();
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST RESULTS SUMMARY:');
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
        console.log('\n🎉 All tests passed! Authentication system is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }
    
    return testResults;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.testAuth = runAllTests;
    console.log('Test script loaded. Run testAuth() in console to start testing.');
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testResults };
}