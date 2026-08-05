use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

use unhinged_security::{
    crypto, jwt, password, validation,
};

/// Application state shared across requests
struct AppState {
    /// JWT configuration
    jwt_config: Mutex<jwt::JwtConfig>,
    /// Encryption configuration
    crypto_config: Mutex<crypto::CryptoConfig>,
    /// Password configuration
    password_config: Mutex<password::PasswordConfig>,
}

/// Request structures
#[derive(Deserialize)]
struct HashPasswordRequest {
    password: String,
    cost_factor: Option<u32>,
}

#[derive(Serialize)]
struct HashPasswordResponse {
    hashed_password: String,
}

#[derive(Deserialize)]
struct VerifyPasswordRequest {
    password: String,
    hashed_password: String,
}

#[derive(Serialize)]
struct VerifyPasswordResponse {
    is_valid: bool,
}

#[derive(Deserialize)]
struct CreateTokenRequest {
    subject: String,
    extra_claims: Option<serde_json::Value>,
    expires_in_seconds: Option<u64>,
}

#[derive(Serialize)]
struct CreateTokenResponse {
    token: String,
}

#[derive(Deserialize)]
struct ValidateTokenRequest {
    token: String,
}

#[derive(Serialize)]
struct ValidateTokenResponse {
    valid: bool,
    subject: Option<String>,
    extra_claims: Option<serde_json::Value>,
}

#[derive(Deserialize)]
struct EncryptRequest {
    data: String, // Base64 encoded data
}

#[derive(Serialize)]
struct EncryptResponse {
    encrypted_data: String, // Base64 encoded
}

#[derive(Deserialize)]
struct DecryptRequest {
    encrypted_data: String, // Base64 encoded
}

#[derive(Serialize)]
struct DecryptResponse {
    data: String, // Base64 encoded
}

#[derive(Deserialize)]
struct ValidateEmailRequest {
    email: String,
}

#[derive(Serialize)]
struct ValidateEmailResponse {
    valid: bool,
}

#[derive(Deserialize)]
struct ValidateUsernameRequest {
    username: String,
}

#[derive(Serialize)]
struct ValidateUsernameResponse {
    valid: bool,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize configurations
    let jwt_config = jwt::JwtConfig {
        secret: std::env::var("JWT_SECRET")
            .unwrap_or_else(|_| "default-jwt-secret-change-in-production-32-bytes".to_string())
            .into_bytes(),
        expires_in: std::env::var("JWT_EXPIRES_IN")
            .unwrap_or_else(|_| "3600".to_string())
            .parse()
            .unwrap_or(3600),
        issuer: std::env::var("JWT_ISSUER").ok(),
        audience: std::env::var("JWT_AUDIENCE").ok(),
    };

    let encryption_key = std::env::var("ENCRYPTION_KEY")
        .map(|key| {
            // Expect hex-encoded 32-byte key
            let mut bytes = [0u8; 32];
            let key_bytes = hex::decode(key).unwrap_or_else(|_| [0u8; 32]);
            bytes.copy_from_slice(&key_bytes[..32.min(key_bytes.len())]);
            bytes
        })
        .unwrap_or_else(crypto::generate_key);

    let crypto_config = crypto::CryptoConfig { key: encryption_key };

    let password_config = password::PasswordConfig {
        cost_factor: std::env::var("PASSWORD_COST_FACTOR")
            .unwrap_or_else(|_| "12".to_string())
            .parse()
            .unwrap_or(12),
        min_length: std::env::var("PASSWORD_MIN_LENGTH")
            .unwrap_or_else(|_| "8".to_string())
            .parse()
            .unwrap_or(8),
        max_length: std::env::var("PASSWORD_MAX_LENGTH")
            .unwrap_or_else(|_| "128".to_string())
            .parse()
            .unwrap_or(128),
        require_uppercase: std::env::var("PASSWORD_REQUIRE_UPPERCASE")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        require_lowercase: std::env::var("PASSWORD_REQUIRE_LOWERCASE")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        require_digits: std::env::var("PASSWORD_REQUIRE_DIGITS")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
        require_special: std::env::var("PASSWORD_REQUIRE_SPECIAL")
            .unwrap_or_else(|_| "true".to_string())
            .parse()
            .unwrap_or(true),
    };

    let state = web::Data::new(AppState {
        jwt_config: Mutex::new(jwt_config),
        crypto_config: Mutex::new(crypto_config),
        password_config: Mutex::new(password_config),
    });

    println!("UNHINGED Security Service starting...");
    println!("JWT Expires in: {} seconds", state.jwt_config.lock().unwrap().expires_in);

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .service(hash_password)
            .service(verify_password)
            .service(create_token)
            .service(validate_token)
            .service(encrypt_data)
            .service(decrypt_data)
            .service(validate_email)
            .service(validate_username)
            .service(health_check)
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}

/// Health check endpoint
#[actix_web::get("/health")]
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "unhinged-security",
        "version": "0.1.0"
    }))
}

/// Hash a password endpoint
#[actix_web::post("/hash-password")]
async fn hash_password(
    req: web::Json<HashPasswordRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    let password_config = state.password_config.lock().unwrap();
    let cost_factor = req.cost_factor.unwrap_or(password_config.cost_factor);

    // Validate password strength
    if let Err(e) = password::validate_password(&req.password, &password_config) {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": e.to_string()
        }));
    }

    match password::hash_password(&req.password, cost_factor) {
        Ok(hashed) => HttpResponse::Ok().json(HashPasswordResponse {
            hashed_password: hashed,
        }),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Verify a password endpoint
#[actix_web::post("/verify-password")]
async fn verify_password(
    req: web::Json<VerifyPasswordRequest>,
) -> impl Responder {
    match password::verify_password(&req.password, &req.hashed_password) {
        Ok(is_valid) => HttpResponse::Ok().json(VerifyPasswordResponse {
            is_valid,
        }),
        Err(e) => HttpResponse::BadRequest().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Create JWT token endpoint
#[actix_web::post("/create-token")]
async fn create_token(
    req: web::Json<CreateTokenRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    let mut claims = jwt::Claims {
        sub: req.subject.clone(),
        iat: 0,
        exp: 0,
        iss: None,
        aud: None,
        extra: serde_json::Map::new(),
    };

    if let Some(extra) = &req.extra_claims {
        if let serde_json::Value::Object(map) = extra {
            for (k, v) in map {
                claims.extra.insert(k.clone(), v.clone());
            }
        }
    }

    let jwt_config = state.jwt_config.lock().unwrap();
    let expires_in = req.expires_in_seconds.unwrap_or(jwt_config.expires_in);

    // Temporarily override expires_in for this token
    let mut temp_config = jwt_config.clone();
    temp_config.expires_in = expires_in;

    match jwt::create_token(claims, &temp_config) {
        Ok(token) => HttpResponse::Ok().json(CreateTokenResponse { token }),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Validate JWT token endpoint
#[actix_web::post("/validate-token")]
async fn validate_token(
    req: web::Json<ValidateTokenRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    let jwt_config = state.jwt_config.lock().unwrap();

    match jwt::validate_token(&req.token, &jwt_config) {
        Ok(claims) => HttpResponse::Ok().json(ValidateTokenResponse {
            valid: true,
            subject: Some(claims.sub),
            extra_claims: if claims.extra.is_empty() {
                None
            } else {
                Some(serde_json::Value::Object(claims.extra))
            },
        }),
        Err(e) => HttpResponse::Unauthorized().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Encrypt data endpoint
#[actix_web::post("/encrypt")]
async fn encrypt_data(
    req: web::Json<EncryptRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    // Decode base64 input
    let data = match base64::decode(&req.data) {
        Ok(d) => d,
        Err(_) => {
            return HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Invalid base64 data"
            }));
        }
    };

    let crypto_config = state.crypto_config.lock().unwrap();

    match crypto::encrypt(&data, &crypto_config) {
        Ok(encrypted) => HttpResponse::Ok().json(EncryptResponse {
            encrypted_data: base64::encode(&encrypted),
        }),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Decrypt data endpoint
#[actix_web::post("/decrypt")]
async fn decrypt_data(
    req: web::Json<DecryptRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    // Decode base64 input
    let encrypted_data = match base64::decode(&req.encrypted_data) {
        Ok(d) => d,
        Err(_) => {
            return HttpResponse::BadRequest().json(serde_json::json!({
                "error": "Invalid base64 data"
            }));
        }
    };

    let crypto_config = state.crypto_config.lock().unwrap();

    match crypto::decrypt(&encrypted_data, &crypto_config) {
        Ok(decrypted) => HttpResponse::Ok().json(DecryptResponse {
            data: base64::encode(&decrypted),
        }),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({
            "error": e.to_string()
        })),
    }
}

/// Validate email endpoint
#[actix_web::post("/validate-email")]
async fn validate_email(
    req: web::Json<ValidateEmailRequest>,
) -> impl Responder {
    match validation::validate_email(&req.email) {
        Ok(_) => HttpResponse::Ok().json(ValidateEmailResponse { valid: true }),
        Err(e) => HttpResponse::Ok().json(ValidateEmailResponse {
            valid: false,
        }),
    }
}

/// Validate username endpoint
#[actix_web::post("/validate-username")]
async fn validate_username(
    req: web::Json<ValidateUsernameRequest>,
) -> impl Responder {
    match validation::validate_username(&req.username) {
        Ok(_) => HttpResponse::Ok().json(ValidateUsernameResponse { valid: true }),
        Err(e) => HttpResponse::Ok().json(ValidateUsernameResponse {
            valid: false,
        }),
    }
}