/**
 * Krushi Drushti - Farmer Authentication & User Management Service
 * Persists and validates farmer credentials in Firebase Realtime Database
 */

import crypto from 'crypto';
import { firebaseService } from './firebaseService.js';

class AuthService {
  /**
   * Hashes a password with a deterministic salt
   */
  hashPassword(password, salt = 'krushi_drishti_salt_2026') {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
  }

  /**
   * Register a new farmer and store credentials in Firebase RTDB
   */
  async register({ name, email, phone, password, village, state = 'Maharashtra', district = 'Nashik', landHoldingAcres = 0, language = 'mr' }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // 1. Check if user already exists with this email or phone
    const existingUsers = await firebaseService.get('users');
    if (existingUsers) {
      const userList = Object.values(existingUsers);
      const duplicate = userList.find(u => u.email === cleanEmail || u.phone === cleanPhone);
      if (duplicate) {
        const field = duplicate.email === cleanEmail ? 'Email' : 'Mobile number';
        throw new Error(`${field} is already registered. Please login instead.`);
      }
    }

    // 2. Generate unique user ID
    const userId = `farmer_${Date.now()}`;
    const passwordHash = this.hashPassword(password);

    const userProfile = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      village: village.trim(),
      state,
      district,
      landHoldingAcres: Number(landHoldingAcres) || 0,
      language,
      createdAt: new Date().toISOString()
    };

    // 3. Store credentials securely in Firebase RTDB at users/{userId}
    await firebaseService.set(`users/${userId}`, {
      ...userProfile,
      passwordHash
    });

    // 4. Also maintain farmer registry at farmers/{userId}
    await firebaseService.set(`farmers/${userId}`, {
      ...userProfile,
      soilType: 'Medium Black Soil',
      irrigationSource: 'Drip / Well',
      activeCrops: ['crop_tomato', 'crop_onion']
    });

    console.log(`[Firebase RTDB] Farmer registered successfully: ${userProfile.name} (${userProfile.email})`);

    return userProfile;
  }

  /**
   * Authenticate a farmer against Firebase RTDB
   */
  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const inputHash = this.hashPassword(password);

    // 1. Fetch users from Firebase RTDB
    const users = await firebaseService.get('users');
    if (!users) {
      throw new Error('No registered farmers found. Please create an account.');
    }

    // 2. Find matching user by email
    const user = Object.values(users).find(u => u.email === cleanEmail);
    if (!user) {
      throw new Error('Account not found with this email. Please register first.');
    }

    // 3. Validate password hash
    if (user.passwordHash !== inputHash) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    // 4. Update last login timestamp in Firebase RTDB
    await firebaseService.update(`users/${user.id}`, {
      lastLoginAt: new Date().toISOString()
    });

    // Return safe user object (without password hash)
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Get user profile by ID
   */
  async getUserById(userId) {
    const user = await firebaseService.get(`users/${userId}`);
    if (!user) return null;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
