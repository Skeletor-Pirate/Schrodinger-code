//! Security utilities for the UNHINGED platform
//!
//! This module provides high-level production-grade security components including:
//! - Password hashing and verification using bcrypt
//! - JWT token generation and validation
//! - Symmetric encryption/decryption for sensitive data
//! - Input validation and sanitization utilities
//! - Cryptographically secure random number generation

use std::fmt;
use std::time::{Duration, SystemTime};

use base64::{engine::general_purpose, Engine as _};
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use validator::Validate;

/// Custom error type for security operations
#[derive(Debug)]
pub enum SecurityError {
    /// Invalid password format or length
    InvalidPassword,
    /// Password verification failed
    InvalidCredentials,
    /// JWT token creation failed
    TokenCreation,
    /// JWT token validation failed
    TokenInvalid,
    /// JWT token has expired
    TokenExpired,
    /// Encryption operation failed
    EncryptionError,
    /// Decryption operation failed
    DecryptionError,
    /// Input validation failed
    ValidationError(String),
    /// Configuration error
    ConfigError(String),
}

impl fmt::Display for SecurityError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            SecurityError::InvalidPassword => write!(f, "Invalid password"),
            SecurityError::InvalidCredentials => write!(f, "Invalid credentials"),
            SecurityError::TokenCreation => write!(f, "Token creation failed"),
            SecurityError::TokenInvalid => write!(f, "Invalid token"),
            SecurityError::TokenExpired => write!(f, "Token has expired"),
            SecurityError::EncryptionError => write!(f, "Encryption failed"),
            SecurityError::DecryptionError => write!(f, "Decryption failed"),
            SecurityError::ValidationError(msg) => write!(f, "Validation error: {}", msg),
            SecurityError::ConfigError(msg) => write!(f, "Configuration error: {}", msg),
        }
    }
}

impl std::error::Error for SecurityError {}

/// Password hashing configuration
#[derive(Debug, Clone)]
pub struct PasswordConfig {
    /// bcrypt cost factor (default: 12)
    pub cost_factor: u32,
    /// Minimum password length (default: 8)
    pub min_length: usize,
    /// Maximum password length (default: 128)
    pub max_length: usize,
    /// Require uppercase letters (default: true)
    pub require_uppercase: bool,
    /// Require lowercase letters (default: true)
    pub require_lowercase: bool,
    /// Require digits (default: true)
    pub require_digits: bool,
    /// Require special characters (default: true)
    pub require_special: bool,
}

impl Default for PasswordConfig {
    fn default() -> Self {
        Self {
            cost_factor: 12,
            min_length: 8,
            max_length: 128,
            require_uppercase: true,
            require_lowercase: true,
            require_digits: true,
            require_special: true,
        }
    }
}

/// Password utilities
pub mod password {
    use super::*;
    use bcrypt::{hash, verify, DEFAULT_COST};

    /// Validates password strength according to the provided configuration
    pub fn validate_password(password: &str, config: &PasswordConfig) -> Result<(), SecurityError> {
        if password.len() < config.min_length {
            return Err(SecurityError::InvalidPassword);
        }

        if password.len() > config.max_length {
            return Err(SecurityError::InvalidPassword);
        }

        if config.require_uppercase && !password.chars().any(|c| c.is_uppercase()) {
            return Err(SecurityError::InvalidPassword);
        }

        if config.require_lowercase && !password.chars().any(|c| c.is_lowercase()) {
            return Err(SecurityError::InvalidPassword);
        }

        if config.require_digits && !password.chars().any(|c| c.is_digit(10)) {
            return Err(SecurityError::InvalidPassword);
        }

        if config.require_special
            && !password.chars().any(|c| !c.is_alphanumeric() && !c.is_whitespace())
        {
            return Err(SecurityError::InvalidPassword);
        }

        Ok(())
    }

    /// Hashes a password using bcrypt with the specified cost factor
    pub fn hash_password(password: &str, cost_factor: u32) -> Result<String, SecurityError> {
        let cost = if cost_factor >= 4 && cost_factor <= 31 {
            cost_factor
        } else {
            DEFAULT_COST
        };

        hash(password, cost).map_err(|_| SecurityError::EncryptionError)
    }

    /// Verifies a password against a bcrypt hash
    pub fn verify_password(password: &str, hashed: &str) -> Result<bool, SecurityError> {
        verify(password, hashed).map_err(|_| SecurityError::InvalidCredentials)
    }
}

/// JWT utilities
pub mod jwt {
    use super::*;
    use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
    use std::collections::HashMap;

    /// JWT claims structure
    #[derive(Debug, Serialize, Deserialize)]
    pub struct Claims {
        /// Subject (usually user ID)
        pub sub: String,
        /// Issued at timestamp
        pub iat: usize,
        /// Expiration timestamp
        pub exp: usize,
        /// Issuer
        pub iss: Option<String>,
        /// Audience
        pub aud: Option<String>,
        /// Custom claims
        #[serde(flatten)]
        pub extra: HashMap<String, serde_json::Value>,
    }

    /// JWT configuration
    #[derive(Debug, Clone)]
    pub struct JwtConfig {
        /// Secret key for signing tokens
        pub secret: Vec<u8>,
        /// Token expiration time in seconds (default: 3600 = 1 hour)
        pub expires_in: u64,
        /// Issuer (optional)
        pub issuer: Option<String>,
        /// Audience (optional)
        pub audience: Option<String>,
    }

    impl Default for JwtConfig {
        fn default() -> Self {
            Self {
                secret: vec![0; 32], // 256-bit key, should be configured properly
                expires_in: 3600,
                issuer: None,
                audience: None,
            }
        }
    }

    /// Creates a new JWT token with the given claims
    pub fn create_token(claims: Claims, config: &JwtConfig) -> Result<String, SecurityError> {
        let mut token_claims = claims;
        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .map_err(|_| SecurityError::TokenCreation)?
            .as_secs();

        token_claims.iat = now as usize;
        token_claims.exp = (now + config.expires_in) as usize;

        // Apply issuer and audience if configured
        if let Some(ref issuer) = config.issuer {
            token_claims.iss = Some(issuer.clone());
        }
        if let Some(ref audience) = config.audience {
            token_claims.aud = Some(audience.clone());
        }

        let encoding_key = EncodingKey::from_secret(&config.secret);
        let header = Header::default();

        encode(&header, &token_claims, &encoding_key)
            .map_err(|_| SecurityError::TokenCreation)
    }

    /// Validates and decodes a JWT token
    pub fn validate_token(token: &str, config: &JwtConfig) -> Result<Claims, SecurityError> {
        let decoding_key = DecodingKey::from_secret(&config.secret);
        let mut validation = Validation::default();

        // Apply issuer and audience validation if configured
        if let Some(ref issuer) = config.issuer {
            validation.set_issuer(&[issuer.clone()]);
        }
        if let Some(ref audience) = config.audience {
            validation.set_audience(&[audience.clone()]);
        }

        // Require expiration validation
        validation.validate_exp = true;

        let token_data = decode::<Claims>(token, &decoding_key, &validation)
            .map_err(|_| SecurityError::TokenInvalid)?;

        Ok(token_data.claims)
    }

    /// Extracts the subject (user ID) from a JWT token
    pub fn extract_subject(token: &str, config: &JwtConfig) -> Result<String, SecurityError> {
        let claims = validate_token(token, config)?;
        Ok(claims.sub)
    }
}

/// Encryption utilities for sensitive data
pub mod crypto {
    use super::*;
    use aes_gcm::{aes::Aes256, Key, Nonce, Aes256Gcm, KeyInit};
    use rand::RngCore;

    /// Encryption configuration
    #[derive(Debug, Clone)]
    pub struct CryptoConfig {
        /// Encryption key (must be 32 bytes for AES-256)
        pub key: [u8; 32],
    }

    /// Encrypts data using AES-256-GCM
    pub fn encrypt(data: &[u8], config: &CryptoConfig) -> Result<Vec<u8>, SecurityError> {
        let key = Key::<Aes256>::from_slice(&config.key);
        let cipher = Aes256Gcm::new(key);

        // Generate a random 96-bit nonce
        let mut nonce_bytes = [0u8; 12];
        let mut rng = OsRng;
        rng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        // Encrypt the data
        let ciphertext = cipher
            .encrypt(nonce, data.as_ref())
            .map_err(|_| SecurityError::EncryptionError)?;

        // Combine nonce + ciphertext for storage/transmission
        let mut result = Vec::with_capacity(nonce_bytes.len() + ciphertext.len());
        result.extend_from_slice(&nonce_bytes);
        result.extend_from_slice(&ciphertext);

        Ok(result)
    }

    /// Decrypts data using AES-256-GCM
    pub fn decrypt(encrypted_data: &[u8], config: &CryptoConfig) -> Result<Vec<u8>, SecurityError> {
        if encrypted_data.len() < 12 {
            return Err(SecurityError::DecryptionError);
        }

        let key = Key::<Aes256>::from_slice(&config.key);
        let cipher = Aes256Gcm::new(key);

        // Extract nonce and ciphertext
        let nonce = Nonce::from_slice(&encrypted_data[..12]);
        let ciphertext = &encrypted_data[12..];

        // Decrypt the data
        let plaintext = cipher
            .decrypt(nonce, ciphertext)
            .map_err(|_| SecurityError::DecryptionError)?;

        Ok(plaintext)
    }

    /// Generates a cryptographically secure random key for encryption
    pub fn generate_key() -> [u8; 32] {
        let mut key = [0u8; 32];
        let mut rng = OsRng;
        rng.fill_bytes(&mut key);
        key
    }
}

/// Input validation utilities
pub mod validation {
    use super::*;
    use validator::{Validate, ValidationError};

    /// Validates email format
    pub fn validate_email(email: &str) -> Result<(), SecurityError> {
        let email_validator = validator::EmailValidator::new();
        if !email_validator.is_valid(email) {
            return Err(SecurityError::ValidationError(
                "Invalid email format".to_string(),
            ));
        }
        Ok(())
    }

    /// Validates username (alphanumeric, underscores, hyphens, 3-30 chars)
    pub fn validate_username(username: &str) -> Result<(), SecurityError> {
        if username.len() < 3 || username.len() > 30 {
            return Err(SecurityError::ValidationError(
                "Username must be between 3 and 30 characters".to_string(),
            ));
        }

        if !username
            .chars()
            .all(|c| c.is_alphanumeric() || c == '_' || c == '-')
        {
            return Err(SecurityError::ValidationError(
                "Username can only contain alphanumeric characters, underscores, and hyphens"
                    .to_string(),
            ));
        }

        Ok(())
    }

    /// Validates that a string is safe for use in filenames/paths
    pub fn validate_safe_string(input: &str) -> Result<(), SecurityError> {
        // Prevent path traversal attempts
        if input.contains("..") || input.contains("/") || input.contains("\\") {
            return Err(SecurityError::ValidationError(
                "Input contains unsafe characters".to_string(),
            ));
        }

        // Prevent null bytes
        if input.contains('\0') {
            return Err(SecurityError::ValidationError(
                "Input contains null bytes".to_string(),
            ));
        }

        Ok(())
    }

    /// Validates string length
    pub fn validate_length(
        input: &str,
        min: usize,
        max: usize,
        field_name: &str,
    ) -> Result<(), SecurityError> {
        if input.len() < min {
            return Err(SecurityError::ValidationError(format!(
                "{} must be at least {} characters",
                field_name, min
            )));
        }

        if input.len() > max {
            return Err(SecurityError::ValidationError(format!(
                "{} must not exceed {} characters",
                field_name, max
            )));
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_password_validation() {
        let config = PasswordConfig::default();

        // Valid password
        assert!(password::validate_password("ValidPass123!", &config).is_ok());

        // Too short
        assert!(password::validate_password("Ab1!", &config).is_err());

        // Missing uppercase
        assert!(password::validate_password("lowercase123!", &config).is_err());

        // Missing lowercase
        assert!(password::validate_password("UPPERCASE123!", &config).is_err());

        // Missing digits
        assert!(password::validate_password("NoDigits!!!", &config).is_err());

        // Missing special characters
        assert!(password::validate_password("NoSpecial123", &config).is_err());
    }

    #[test]
    fn test_password_hashing() {
        let password = "SecurePassword123!";
        let hashed = password::hash_password(password, 12).unwrap();
        assert_ne!(password, hashed);
        assert!(password::verify_password(password, &hashed).unwrap());
        assert!(!password::verify_password("WrongPassword", &hashed).unwrap());
    }

    #[test]
    fn test_jwt_tokens() {
        let mut claims = Claims {
            sub: "user123".to_string(),
            iat: 0,
            exp: 0,
            iss: None,
            aud: None,
            extra: HashMap::new(),
        };
        claims.extra.insert("role".to_string(), serde_json::json!("admin"));

        let config = JwtConfig {
            secret: b"test-secret-key-32-bytes-long!!".to_vec(),
            expires_in: 3600,
            issuer: Some("unhinged".to_string()),
            audience: Some("users".to_string()),
            ..Default::default()
        };

        let token = jwt::create_token(claims.clone(), &config).unwrap();
        let validated_claims = jwt::validate_token(&token, &config).unwrap();

        assert_eq!(validated_claims.sub, claims.sub);
        assert_eq!(validated_claims.iss, Some("unhinged".to_string()));
        assert_eq!(validated_claims.aud, Some("users".to_string()));
        assert_eq!(
            validated_claims.extra.get("role"),
            Some(&serde_json::json!("admin"))
        );

        let subject = jwt::extract_subject(&token, &config).unwrap();
        assert_eq!(subject, claims.sub);
    }

    #[test]
    fn test_encryption() {
        let data = b"sensitive data";
        let key = crypto::generate_key();
        let config = CryptoConfig { key };

        let encrypted = crypto::encrypt(data, &config).unwrap();
        assert_ne!(data.to_vec(), encrypted);

        let decrypted = crypto::decrypt(&encrypted, &config).unwrap();
        assert_eq!(data.to_vec(), decrypted);
    }

    #[test]
    fn test_validation() {
        // Email validation
        assert!(validation::validate_email("test@example.com").is_ok());
        assert!(validation::validate_email("invalid-email").is_err());

        // Username validation
        assert!(validation::validate_username("valid_user").is_ok());
        assert!(validation::validate_username("ab").is_err()); // too short
        assert!(validation::validate_username("invalid@user").is_err()); // invalid char

        // Safe string validation
        assert!(validation::validate_safe_string("safe-string").is_ok());
        assert!(validation::validate_safe_string("../etc/passwd").is_err());
        assert!(validation::validate_safe_string("null\x00byte").is_err());

        // Length validation
        assert!(validation::validate_length("hello", 3, 10, "test").is_ok());
        assert!(validation::validate_length("hi", 3, 10, "test").is_err()); // too short
        assert!(validation::validate_length("verylongstring", 3, 10, "test").is_err()); // too long
    }
}