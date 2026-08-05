/**
 * User Management Service
 * Handles user-related operations for the admin console
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

class UserManagementService {
  /**
   * Get all users with optional filtering
   * @param {Object} filters - Filter options (role, status, searchTerm)
   * @returns {Promise<Array>} List of users
   */
  async getUsers(filters = {}) {
    const { role, status, searchTerm, page = 1, limit = 50 } = filters;

    const where = {};

    if (role) where.role = role;
    if (status) where.status = status;
    if (searchTerm) {
      where.OR = [
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { display_name: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          display_name: true,
          avatar_url: true,
          status: true,
          role: true,
          google_id: true,
          mfa_enabled: true,
          primary_workspace_id: true,
          created_at: true,
          last_login_at: true,
          deleted_at: true
        }
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  /**
   * Get a user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        display_name: true,
        avatar_url: true,
        status: true,
        role: true,
        google_id: true,
        mfa_enabled: true,
        primary_workspace_id: true,
        created_at: true,
        last_login_at: true,
        deleted_at: true
      }
    });
  }

  /**
   * Get a user by email
   * @param {string} email - User email
   * @returns {Promise<Object>} User object
   */
  async getUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        display_name: true,
        avatar_url: true,
        status: true,
        role: true,
        google_id: true,
        mfa_enabled: true,
        primary_workspace_id: true,
        created_at: true,
        last_login_at: true,
        deleted_at: true
      }
    });
  }

  /**
   * Get a user by Google ID
   * @param {string} googleId - User Google ID
   * @returns {Promise<Object>} User object
   */
  async getUserByGoogleId(googleId) {
    return prisma.user.findUnique({
      where: { google_id: googleId },
      select: {
        id: true,
        email: true,
        display_name: true,
        avatar_url: true,
        status: true,
        role: true,
        google_id: true,
        mfa_enabled: true,
        primary_workspace_id: true,
        created_at: true,
        last_login_at: true,
        deleted_at: true
      }
    });
  }

  /**
   * Update user status (activate, suspend, ban)
   * @param {string} userId - User ID
   * @param {string} status - New status (pending, active, suspended, banned)
   * @returns {Promise<Object>} Updated user
   */
  async updateUserStatus(userId, status) {
    const validStatuses = ['pending', 'active', 'suspended', 'banned'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        display_name: true,
        status: true
      }
    });
  }

  /**
   * Update user role
   @param {string} userId - User ID
   * @param {string} role - New role (admin, moderator, member, guest)
   * @returns {Promise<Object>} Updated user
   */
  async updateUserRole(userId, role) {
    const validRoles = ['admin', 'moderator', 'member', 'guest'];
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        display_name: true,
        role: true
      }
    });
  }

  /**
   * Delete a user (soft delete)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { deleted_at: new Date() },
      select: {
        id: true,
        email: true,
        deleted_at: true
      }
    });
  }

  /**
   * Restore a soft-deleted user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Restored user
   */
  async restoreUser(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { deleted_at: null },
      select: {
        id: true,
        email: true,
        deleted_at: true
      }
    });
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  async getUserStats() {
    const [totalUsers, activeUsers, suspendedUsers, bannedUsers, usersByRole] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      prisma.user.count({ where: { status: 'suspended' } }),
      prisma.user.count({ where: { status: 'banned' } }),
      prisma.user.groupBy({
        by: ['role'],
        _count: true
      })
    ]);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      bannedUsers,
      usersByRole: Object.fromEntries(usersByRole.map(r => [r.role, r._count]))
    };
  }

  /**
   * Create a pending password reset token (valid for 5 minutes)
   * @param {string} userId - User ID
   * @returns {Promise<string>} Password reset token
   */
  async createPasswordResetToken(userId) {
    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');

    // Store the token with expiration (5 minutes from now)
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // In a production system, you might store this in a separate table
    // For now, we'll add it to the user record temporarily
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires
      }
    });

    return token;
  }

  /**
   * Validate a password reset token
   * @param {string} token - Password reset token
   * @returns {Promise<Object|null>} User object if token is valid, null otherwise
   */
  async validatePasswordResetToken(token) {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        }
      }
    });

    return user || null;
  }

  /**
   * Reset user password using a valid token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password to set
   * @returns {Promise<Object>} Updated user object
   */
  async resetPassword(token, newPassword) {
    // Validate the token first
    const user = await this.validatePasswordResetToken(token);

    if (!user) {
      throw new Error('Invalid or expired password reset token');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        avatar_url: true,
        status: true,
        role: true,
        google_id: true,
        mfa_enabled: true,
        primary_workspace_id: true,
        created_at: true,
        last_login_at: true,
        deleted_at: true
      }
    });

    return updatedUser;
  }

  /**
   * Initiate password reset process (only for Google-authenticated users)
   * @param {string} email - User email
   * @returns {Promise<Object>} Result with reset token or error
   */
  async initiatePasswordReset(email) {
    // Find user by email
    const user = await this.getUserByEmail(email);

    if (!user) {
      // For security, don't reveal whether the email exists
      return {
        success: true,
        message: 'If the email exists and is associated with a Google account, you will receive reset instructions'
      };
    }

    // Check if user has Google authentication (has google_id)
    if (!user.google_id) {
      return {
        success: false,
        error: 'Password reset is only available for users who signed up with Google'
      };
    }

    // Generate reset token
    const resetToken = await this.createPasswordResetToken(user.id);

    // In a production system, you would send this token via email
    // For now, we'll return it (in reality, this should be sent via email only)

    return {
      success: true,
      token: resetToken, // In production, this would be sent via email and not returned
      message: 'Password reset token generated. Check your email for further instructions.'
    };
  }
}

module.exports = new UserManagementService();