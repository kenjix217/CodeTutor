/**
 * Auth Manager
 * Handles Login, Registration, and JWT Storage
 */

import { Config } from './config.js?v=43';

export class AuthManager {
    constructor() {
        this.token = localStorage.getItem('access_token');
        this.user = null;
        this.isAuthenticated = !!this.token;
    }

    /**
     * Register a new user
     */
    async register(username, password, email, firstName, lastName, dob) {
        try {
            const response = await fetch(`${Config.platform.backendURL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username, 
                    password, 
                    email, 
                    first_name: firstName, 
                    last_name: lastName,
                    dob
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Registration failed');
            }

            const data = await response.json();
            this.setToken(data.access_token);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Login user
     */
    async login(username, password) {
        try {
            const response = await fetch(`${Config.platform.backendURL}/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            this.setToken(data.access_token);
            await this.fetchUserProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('access_token');
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        window.location.reload(); // Refresh to clear state
    }

    /**
     * Store token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('access_token', token);
        this.isAuthenticated = true;
    }

    /**
     * Get User Profile
     */
    async fetchUserProfile() {
        if (!this.token) return;

        try {
            const response = await fetch(`${Config.platform.backendURL}/users/me`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });

            if (response.ok) {
                this.user = await response.json();
            } else {
                // Token invalid
                this.logout();
            }
        } catch (e) {
            console.error("Auth Error:", e);
        }
    }
    
    /**
     * Save API Key to Vault
     */
    async saveApiKeyToVault(apiKey) {
        if (!this.token) return { success: false, error: "Not logged in" };
        
        try {
            const response = await fetch(`${Config.platform.backendURL}/vault`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ api_key: apiKey })
            });
            
            return { success: response.ok };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Change user password
     */
    async changePassword(currentPassword, newPassword) {
        if (!this.token) return { success: false, error: "Not logged in" };
        
        try {
            const response = await fetch(`${Config.platform.backendURL}/users/change-password`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ 
                    current_password: currentPassword,
                    new_password: newPassword 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return { success: true, message: data.message };
            } else {
                return { success: false, error: data.detail || "Failed to change password" };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        if (!this.token) return { success: false, error: "Not logged in" };
        
        try {
            const response = await fetch(`${Config.platform.backendURL}/users/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(profileData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Update local user data
                this.user = { ...this.user, ...data.user };
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.detail || "Failed to update profile" };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Delete user account permanently
     */
    async deleteAccount() {
        if (!this.token) return { success: false, error: "Not logged in" };
        
        try {
            const response = await fetch(`${Config.platform.backendURL}/users/account`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                // Clear local data
                this.logout();
                return { success: true };
            } else {
                const data = await response.json();
                return { success: false, error: data.detail || "Failed to delete account" };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    }
}
