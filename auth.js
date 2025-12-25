// Simple Authentication System for PulseBuy Demo
// This uses localStorage to simulate user authentication

// Predefined demo users
const demoUsers = [
    {
        id: 1,
        username: "buyer123",
        email: "buyer@example.com",
        password: "buyer123",
        role: "buyer",
        fullName: "John Smith",
        phone: "+27 12 345 6789"
    },
    {
        id: 2,
        username: "seller123",
        email: "seller@example.com",
        password: "seller123",
        role: "seller",
        fullName: "Sarah Johnson",
        phone: "+27 13 456 7890"
    },
    {
        id: 3,
        username: "admin123",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        fullName: "Admin User",
        phone: "+27 14 567 8901"
    }
];

// Authentication functions
const Auth = {
    // Login function
    login: function(email, password, remember = false) {
        const user = demoUsers.find(u => 
            (u.email === email || u.username === email) && u.password === password
        );

        if (user) {
            const userSession = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                phone: user.phone,
                loginTime: new Date().toISOString()
            };

            // Store in sessionStorage (or localStorage if remember is true)
            const storage = remember ? localStorage : sessionStorage;
            storage.setItem('pulsebuy_user', JSON.stringify(userSession));

            return { success: true, user: userSession, role: user.role };
        }

        return { success: false, message: "Invalid email/username or password" };
    },

    // Signup function
    signup: function(userData) {
        // Check if user already exists
        const existingUser = demoUsers.find(u => 
            u.email === userData.email || u.username === userData.username
        );

        if (existingUser) {
            return { success: false, message: "User with this email or username already exists" };
        }

        // Create new user (in a real app, this would be sent to a server)
        const newUser = {
            id: demoUsers.length + 1,
            username: userData.username || userData.email.split('@')[0],
            email: userData.email,
            password: userData.password,
            role: userData.role,
            fullName: userData.fullName,
            phone: userData.phone
        };

        // Add to demo users array (for demo purposes only)
        demoUsers.push(newUser);

        // Auto-login after signup
        const userSession = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            fullName: newUser.fullName,
            phone: newUser.phone,
            loginTime: new Date().toISOString()
        };

        sessionStorage.setItem('pulsebuy_user', JSON.stringify(userSession));

        return { success: true, user: userSession, role: newUser.role };
    },

    // Get current user
    getCurrentUser: function() {
        const userStr = sessionStorage.getItem('pulsebuy_user') || localStorage.getItem('pulsebuy_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return this.getCurrentUser() !== null;
    },

    // Check user role
    getUserRole: function() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    },

    // Logout function
    logout: function() {
        // Show logout message and redirect
        const user = this.getCurrentUser(); // Get user before clearing
        if (user) {
            alert(`Goodbye, ${user.fullName || user.username}! You have been logged out successfully.`);
        }
        
        sessionStorage.removeItem('pulsebuy_user');
        localStorage.removeItem('pulsebuy_user');
        window.location.href = 'loginSignup.html';
    },

    // Redirect based on role
    redirectAfterLogin: function(role) {
        switch(role) {
            case 'buyer':
                window.location.href = 'buyer_welcome.html';
                break;
            case 'seller':
                window.location.href = 'seller_welcome.html';
                break;
            case 'admin':
                window.location.href = 'admin.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    },

    // Check if user has access to a page
    requireAuth: function(requiredRole = null) {
        const user = this.getCurrentUser();
        
        if (!user) {
            window.location.href = 'loginSignup.html';
            return false;
        }

        if (requiredRole && user.role !== requiredRole) {
            alert('Access denied. You do not have permission to view this page.');
            this.redirectAfterLogin(user.role);
            return false;
        }

        return true;
    },

    // Update user display name
    updateDisplayName: function() {
        const user = this.getCurrentUser();
        if (user) {
            const elements = document.querySelectorAll('.username, .user-name, .display-name');
            elements.forEach(element => {
                element.textContent = user.fullName || user.username;
            });
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}