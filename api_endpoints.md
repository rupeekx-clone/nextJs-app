# Backend API Endpoints

## Endpoint Group: Authentication

### 1. Register User
*   **Description:** Register a new user (customer or cash lending customer).
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/register`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "full_name": "string (required)",
      "email": "string (required, valid email)",
      "phone_number": "string (required, valid Indian phone format)",
      "password": "string (required, min 8 characters, strong password policies)",
      "address_line1": "string (optional)",
      "address_line2": "string (optional)",
      "city": "string (optional)",
      "pincode": "string (optional, valid Indian pincode)",
      "user_type": "string (optional, enum: 'customer', 'cash_lending_customer', default: 'customer')"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "user_id": "uuid",
      "full_name": "string",
      "email": "string",
      "phone_number": "string",
      "user_type": "string",
      "access_token": "string (jwt)",
      "refresh_token": "string (jwt)",
      "message": "Registration successful. Please verify your email/phone."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }` (e.g., invalid email format, weak password)
    *   `409 Conflict`: `{ "error": "User already exists with this email or phone number" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. Login User
*   **Description:** Login an existing user and return JWT tokens.
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/login`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "email_or_phone": "string (required)", // User can login with either email or phone
      "password": "string (required)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "user_id": "uuid",
      "full_name": "string",
      "email": "string",
      "user_type": "string", // 'customer', 'cash_lending_customer', 'admin'
      "access_token": "string (jwt)",
      "refresh_token": "string (jwt)",
      "message": "Login successful"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }`
    *   `401 Unauthorized`: `{ "error": "Invalid credentials" }`
    *   `404 Not Found`: `{ "error": "User not found" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 3. Logout User
*   **Description:** Logout the currently authenticated user (invalidate tokens if possible, client-side token removal is primary).
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/logout`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** (Optional, might include refresh token for server-side invalidation)
    ```json
    {
      "refresh_token": "string (optional)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Logout successful"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 4. Refresh Access Token
*   **Description:** Obtain a new access token using a refresh token.
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/refresh-token`
*   **Authentication:** None (Refresh token is sent in body)
*   **Request Body (JSON):**
    ```json
    {
      "refresh_token": "string (required)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "access_token": "string (jwt)",
      "message": "Access token refreshed successfully"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "Invalid or expired refresh token" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 5. Verify Email (Conceptual)
*   **Description:** Verify user's email using a token sent to their email address.
*   **HTTP Method:** `GET`
*   **Path:** `/api/auth/verify-email?token=<verification_token>`
*   **Authentication:** None
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Email verified successfully"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Invalid or expired verification token" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 6. Mobile Authentication (Unified Login/Signup)
*   **Description:** Send OTP to mobile number for authentication. Creates new user if doesn't exist, sends OTP to existing users.
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/mobile-auth`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "phone_number": "string (required, 10-digit Indian mobile number)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "OTP sent successfully to your mobile number.",
      "phone_number": "9876543210"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "success": false, "message": "Invalid phone number format. Please enter a valid 10-digit Indian mobile number." }`
    *   `500 Internal Server Error`: `{ "success": false, "message": "Failed to send OTP. Please try again or contact support." }`

### 7. Verify Mobile OTP
*   **Description:** Verify OTP and complete mobile authentication. Returns 7-day access token.
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/verify-mobile-otp`
*   **Authentication:** None
*   **Request Body (JSON):**
    ```json
    {
      "phone_number": "string (required, 10-digit Indian mobile number)",
      "otp": "string (required, 6 digits)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Login successful! Welcome to Blumiq.",
      "tokens": {
        "accessToken": "string (jwt, 7-day expiry)",
        "refreshToken": "string (jwt, 7-day expiry)"
      },
      "user": {
        "user_id": "uuid",
        "full_name": "string",
        "phone_number": "9876543210",
        "user_type": "customer",
        "is_phone_verified": true,
        "status": "active",
        "created_at": "timestamp",
        "updated_at": "timestamp"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "success": false, "message": "Invalid OTP. Please check and try again." }`
    *   `400 Bad Request`: `{ "success": false, "message": "OTP has expired. Please request a new one." }`
    *   `404 Not Found`: `{ "success": false, "message": "User not found. Please request OTP again." }`
    *   `500 Internal Server Error`: `{ "success": false, "message": "An unexpected error occurred during verification. Please try again." }`

### 8. Verify Phone (Legacy)
*   **Description:** Verify user's phone using an OTP sent to their phone number (legacy endpoint).
*   **HTTP Method:** `POST`
*   **Path:** `/api/auth/verify-otp`
*   **Authentication:** User Token Required (or a temporary token if verifying during registration flow)
*   **Request Body (JSON):**
    ```json
    {
      "phone_number": "string (required)",
      "otp_entered": "string (required, 6 digits)"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Phone verified successfully. Logged in.",
      "tokens": {
        "accessToken": "string (jwt)",
        "refreshToken": "string (jwt)"
      },
      "user": {
        "user_id": "uuid",
        "full_name": "string",
        "phone_number": "string",
        "user_type": "string",
        "is_phone_verified": true,
        "status": "active"
      }
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "success": false, "message": "Invalid OTP." }`
    *   `400 Bad Request`: `{ "success": false, "message": "OTP has expired. Please request a new one." }`
    *   `500 Internal Server Error`: `{ "success": false, "message": "An unexpected error occurred during OTP verification." }`

---
## Endpoint Group: User Profile

### 1. Get User Profile
*   **Description:** Retrieve the profile information of the authenticated user.
*   **HTTP Method:** `GET`
*   **Path:** `/api/users/me`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "user_id": "uuid",
      "full_name": "string",
      "email": "string",
      "phone_number": "string",
      "address_line1": "string",
      "address_line2": "string",
      "city": "string",
      "pincode": "string",
      "user_type": "string",
      "email_verified_at": "timestamp (nullable)",
      "phone_verified_at": "timestamp (nullable)",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `404 Not Found`: `{ "error": "User profile not found" }` (should not happen if token is valid)
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. Update User Profile
*   **Description:** Update the profile information of the authenticated user.
*   **HTTP Method:** `PUT`
*   **Path:** `/api/users/me`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** (Fields are optional, only provided fields will be updated)
    ```json
    {
      "full_name": "string (optional)",
      "address_line1": "string (optional)",
      "address_line2": "string (optional)",
      "city": "string (optional)",
      "pincode": "string (optional, valid Indian pincode)"
      // Email and phone number changes might need a separate verification flow
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "user_id": "uuid",
      "full_name": "string",
      "email": "string", // Unchanged by this endpoint typically
      "phone_number": "string", // Unchanged by this endpoint typically
      "address_line1": "string",
      "address_line2": "string",
      "city": "string",
      "pincode": "string",
      "user_type": "string",
      "email_verified_at": "timestamp (nullable)",
      "phone_verified_at": "timestamp (nullable)",
      "updated_at": "timestamp",
      "message": "Profile updated successfully"
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }`
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Loan Applications

### 1. Apply for Loan
*   **Description:** Submit a new loan application (Personal or Business).
*   **HTTP Method:** `POST`
*   **Path:** `/api/loans/apply`
*   **Authentication:** User Token Required
*   **Request Body (JSON):**
    ```json
    {
      "loan_type": "string (required, enum: 'personal', 'business')",
      "amount_requested": "decimal (required, positive value)",
      "tenure_months_requested": "integer (required, positive value)",
      "documents_submitted": { // Optional, structure depends on how documents are handled (e.g., pre-signed URLs from a file upload service)
        "pan_card_url": "string (url, optional)",
        "aadhaar_card_url": "string (url, optional)",
        "bank_statement_url": "string (url, optional)",
        "business_registration_url": "string (url, optional, required if loan_type is 'business')"
        // ... other document types
      }
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "application_id": "uuid",
      "user_id": "uuid",
      "loan_type": "string",
      "amount_requested": "decimal",
      "tenure_months_requested": "integer",
      "status": "string (e.g., 'submitted' or 'requires_documents')",
      "application_date": "timestamp",
      "documents_submitted": {},
      "message": "Loan application submitted successfully."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }`
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `403 Forbidden`: `{ "error": "User not eligible to apply for this loan type (e.g., no membership)" }` (if specific rules apply)
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. List User's Loan Applications
*   **Description:** Retrieve a list of loan applications submitted by the authenticated user.
*   **HTTP Method:** `GET`
*   **Path:** `/api/loans`
*   **Authentication:** User Token Required
*   **Query Parameters (Optional):**
    *   `status=<status_enum>`: Filter by status
    *   `loan_type=<type_enum>`: Filter by loan type
    *   `page=<number>`: For pagination
    *   `limit=<number>`: For pagination
*   **Success Response (200 OK):**
    ```json
    {
      "data": [
        {
          "application_id": "uuid",
          "loan_type": "string",
          "amount_requested": "decimal",
          "amount_approved": "decimal (nullable)",
          "status": "string",
          "application_date": "timestamp",
          "updated_at": "timestamp"
        }
        // ... more applications
      ],
      "pagination": {
        "current_page": "integer",
        "per_page": "integer",
        "total_entries": "integer",
        "total_pages": "integer"
      }
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 3. Get Specific Loan Application Details
*   **Description:** Retrieve the details of a specific loan application owned by the authenticated user.
*   **HTTP Method:** `GET`
*   **Path:** `/api/loans/{application_id}`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "application_id": "uuid",
      "user_id": "uuid",
      "loan_type": "string",
      "amount_requested": "decimal",
      "amount_approved": "decimal (nullable)",
      "interest_rate_proposed": "decimal (nullable)",
      "interest_rate_final": "decimal (nullable)",
      "tenure_months_requested": "integer",
      "tenure_months_final": "integer (nullable)",
      "status": "string",
      "bank_partner_id": "uuid (nullable)",
      "bank_partner_name": "string (nullable, joined from BankPartners)",
      "application_date": "timestamp",
      "documents_submitted": { /* ... */ },
      "admin_remarks": "text (nullable)",
      "approved_at": "timestamp (nullable)",
      "disbursed_at": "timestamp (nullable)",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `403 Forbidden`: `{ "error": "User does not have access to this loan application" }`
    *   `404 Not Found`: `{ "error": "Loan application not found" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Membership Cards

### 1. List Available Membership Card Types
*   **Description:** Retrieve a list of all active and available membership card types (products).
*   **HTTP Method:** `GET`
*   **Path:** `/api/memberships/types`
*   **Authentication:** None (or User Token Required, depending on business logic)
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "data": [
        {
          "card_type_id": "uuid",
          "name": "string",
          "description": "text (nullable)",
          "price": "decimal",
          "validity_months": "integer",
          "benefits_description": "text",
          "loan_type_association": "string (enum: 'personal', 'business', 'any', nullable)",
          "max_loan_amount_benefit": "decimal (nullable)",
          "processing_time_benefit": "string (nullable)"
        }
        // ... more card types
      ]
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. Purchase Membership Card
*   **Description:** Allow an authenticated user to purchase a membership card.
*   **HTTP Method:** `POST`
*   **Path:** `/api/memberships/purchase`
*   **Authentication:** User Token Required
*   **Request Body (JSON):**
    ```json
    {
      "card_type_id": "uuid (required)",
      "payment_reference": "string (required, from payment gateway)" // e.g., transaction ID
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "membership_card_id": "uuid",
      "user_id": "uuid",
      "card_type_id": "uuid",
      "card_type_name": "string",
      "purchase_date": "timestamp",
      "expiry_date": "timestamp",
      "status": "string (e.g., 'active')",
      "message": "Membership card purchased successfully."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }` (e.g., invalid card_type_id, missing payment_reference)
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `404 Not Found`: `{ "error": "Membership card type not found or not active" }`
    *   `409 Conflict`: `{ "error": "User already has an active membership card" }` (if only one active card allowed as per schema)
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 3. Get Current User's Membership Card
*   **Description:** Retrieve the details of the authenticated user's active membership card.
*   **HTTP Method:** `GET`
*   **Path:** `/api/memberships/me`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "membership_card_id": "uuid",
      "user_id": "uuid",
      "card_type_id": "uuid",
      "card_type_name": "string", // Joined from MembershipCardTypes
      "purchase_date": "timestamp",
      "expiry_date": "timestamp",
      "status": "string",
      "benefits_availed": {}, // JSONB
      "benefits_description": "text", // From MembershipCardTypes
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `404 Not Found`: `{ "error": "No active membership card found for this user" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Cash Lending Subscriptions

### 1. List Available Cash Lending Subscription Plans
*   **Description:** Retrieve a list of all active cash lending subscription plans.
*   **HTTP Method:** `GET`
*   **Path:** `/api/cash-lending/plans`
*   **Authentication:** None (or User Token Required)
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "data": [
        {
          "plan_id": "uuid",
          "name": "string",
          "description": "text (nullable)",
          "price": "decimal",
          "duration_days": "integer",
          "features": {} // JSONB
        }
        // ... more plans
      ]
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. Subscribe to Cash Lending Plan
*   **Description:** Allow an authenticated user (typically 'cash_lending_customer') to subscribe to a plan.
*   **HTTP Method:** `POST`
*   **Path:** `/api/cash-lending/subscribe`
*   **Authentication:** User Token Required (user_type should be 'cash_lending_customer' or have specific permissions)
*   **Request Body (JSON):**
    ```json
    {
      "plan_id": "uuid (required)",
      "payment_reference": "string (required, from payment gateway)"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "subscription_id": "uuid",
      "user_id": "uuid",
      "plan_id": "uuid",
      "plan_name": "string",
      "start_date": "timestamp",
      "end_date": "timestamp",
      "status": "string (e.g., 'active')",
      "message": "Subscription activated successfully."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }`
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `403 Forbidden`: `{ "error": "User not eligible for cash lending subscriptions" }`
    *   `404 Not Found`: `{ "error": "Subscription plan not found or not active" }`
    *   `409 Conflict`: `{ "error": "User already has an active subscription" }` (if only one active subscription allowed)
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 3. Get Current User's Cash Lending Subscription
*   **Description:** Retrieve details of the authenticated user's active cash lending subscription.
*   **HTTP Method:** `GET`
*   **Path:** `/api/cash-lending/me`
*   **Authentication:** User Token Required
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "subscription_id": "uuid",
      "user_id": "uuid",
      "plan_id": "uuid",
      "plan_name": "string", // Joined from CashLendingSubscriptionPlans
      "start_date": "timestamp",
      "end_date": "timestamp",
      "status": "string",
      "features": {}, // From CashLendingSubscriptionPlans
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
*   **Error Responses:**
    *   `401 Unauthorized`: `{ "error": "User not authenticated" }`
    *   `404 Not Found`: `{ "error": "No active cash lending subscription found for this user" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Informational Endpoints

### 1. Get Static Content by Slug
*   **Description:** Retrieve a specific static content page (e.g., FAQ, Privacy Policy) by its slug.
*   **HTTP Method:** `GET`
*   **Path:** `/api/content/{slug}`
*   **Authentication:** None
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "content_id": "uuid",
      "slug": "string",
      "title": "string",
      "content_body": "text (html/markdown/plain)",
      "meta_description": "string (nullable)",
      "updated_at": "timestamp"
    }
    ```
*   **Error Responses:**
    *   `404 Not Found`: `{ "error": "Content not found or not published" }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

### 2. List Bank Partners
*   **Description:** Retrieve a list of active bank partners.
*   **HTTP Method:** `GET`
*   **Path:** `/api/bank-partners`
*   **Authentication:** None (or User Token Required)
*   **Request Body (JSON):** None
*   **Success Response (200 OK):**
    ```json
    {
      "data": [
        {
          "bank_partner_id": "uuid",
          "name": "string",
          "logo_url": "string (url, nullable)"
        }
        // ... more bank partners
      ]
    }
    ```
*   **Error Responses:**
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Support/Enquiries

### 1. Submit Enquiry
*   **Description:** Allow users or visitors to submit an enquiry or support request.
*   **HTTP Method:** `POST`
*   **Path:** `/api/enquiries`
*   **Authentication:** None (or User Token Required if for logged-in users only)
*   **Request Body (JSON):**
    ```json
    {
      "name": "string (required, prefill if user is logged in)",
      "email": "string (required, valid email, prefill if user is logged in)",
      "phone_number": "string (required, prefill if user is logged in)",
      "subject": "string (optional)",
      "message": "text (required)"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "enquiry_id": "uuid",
      "name": "string",
      "email": "string",
      "subject": "string (nullable)",
      "status": "string (default: 'new')",
      "message": "Enquiry submitted successfully. We will get back to you soon."
    }
    ```
*   **Error Responses:**
    *   `400 Bad Request`: `{ "error": "Validation failed", "details": { "field_name": "error message" } }`
    *   `500 Internal Server Error`: `{ "error": "An unexpected error occurred" }`

---
## Endpoint Group: Admin Endpoints (Conceptual)

**Note:** All endpoints in this group require **Admin Token Required** for authentication. Standard error responses (`401 Unauthorized`, `403 Forbidden`, `500 Internal Server Error`) apply.

### Users Management
*   **1. List All Users**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/users`
    *   **Query Parameters:** `page`, `limit`, `user_type`, `email`, `phone_number`
    *   **Success Response (200 OK):** Paginated list of user objects.
        ```json
        {
          "data": [ /* user objects from Users table */ ],
          "pagination": { /* ... */ }
        }
        ```
*   **2. Get User Details by ID**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/users/{user_id}`
    *   **Success Response (200 OK):** Full user object.
*   **3. Update User (e.g., change user_type, verify email/phone manually)**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/users/{user_id}`
    *   **Request Body (JSON):** Fields from `Users` table to update.
    *   **Success Response (200 OK):** Updated user object.

### Loan Application Management
*   **1. List All Loan Applications**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/loans`
    *   **Query Parameters:** `page`, `limit`, `status`, `user_id`, `loan_type`
    *   **Success Response (200 OK):** Paginated list of loan application objects.
*   **2. Get Specific Loan Application Details (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/loans/{application_id}`
    *   **Success Response (200 OK):** Full loan application object.
*   **3. Update Loan Application Status & Details**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/loans/{application_id}`
    *   **Request Body (JSON):**
        ```json
        {
          "status": "string (enum from schema, e.g., 'under_review', 'approved', 'rejected', 'disbursed')",
          "amount_approved": "decimal (optional)",
          "interest_rate_final": "decimal (optional)",
          "tenure_months_final": "integer (optional)",
          "bank_partner_id": "uuid (optional)",
          "admin_remarks": "text (optional)"
          // Other fields like approved_at, disbursed_at might be set server-side based on status
        }
        ```
    *   **Success Response (200 OK):** Updated loan application object.
    *   **Error Responses:** `404 Not Found`, `400 Bad Request`

### Bank Partners Management (CRUD)
*   **1. Create Bank Partner**
    *   **HTTP Method:** `POST`
    *   **Path:** `/api/admin/bank-partners`
    *   **Request Body (JSON):** Fields from `BankPartners` table (name required).
    *   **Success Response (201 Created):** Created bank partner object.
*   **2. List Bank Partners (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/bank-partners`
    *   **Query Parameters:** `page`, `limit`, `is_active`
    *   **Success Response (200 OK):** Paginated list of bank partners.
*   **3. Get Bank Partner by ID**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/bank-partners/{bank_partner_id}`
    *   **Success Response (200 OK):** Bank partner object.
*   **4. Update Bank Partner**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/bank-partners/{bank_partner_id}`
    *   **Request Body (JSON):** Fields from `BankPartners` table to update.
    *   **Success Response (200 OK):** Updated bank partner object.
*   **5. Delete Bank Partner**
    *   **HTTP Method:** `DELETE`
    *   **Path:** `/api/admin/bank-partners/{bank_partner_id}`
    *   **Success Response (204 No Content):**
    *   **Note:** Consider soft delete (`is_active = false`) vs hard delete.

### Membership Card Types Management (CRUD)
*   **1. Create Membership Card Type**
    *   **HTTP Method:** `POST`
    *   **Path:** `/api/admin/membership-types`
    *   **Request Body (JSON):** Fields from `MembershipCardTypes` table (name, price, validity_months, benefits_description required).
    *   **Success Response (201 Created):** Created card type object.
*   **2. List Membership Card Types (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/membership-types`
    *   **Query Parameters:** `page`, `limit`, `is_active`
    *   **Success Response (200 OK):** Paginated list of card types.
*   **3. Get Membership Card Type by ID**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/membership-types/{card_type_id}`
    *   **Success Response (200 OK):** Card type object.
*   **4. Update Membership Card Type**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/membership-types/{card_type_id}`
    *   **Request Body (JSON):** Fields from `MembershipCardTypes` table to update.
    *   **Success Response (200 OK):** Updated card type object.
*   **5. Delete Membership Card Type**
    *   **HTTP Method:** `DELETE`
    *   **Path:** `/api/admin/membership-types/{card_type_id}`
    *   **Success Response (204 No Content):**
    *   **Note:** Consider soft delete (`is_active = false`).

### Cash Lending Subscription Plans Management (CRUD)
*   **1. Create Subscription Plan**
    *   **HTTP Method:** `POST`
    *   **Path:** `/api/admin/cash-lending/plans`
    *   **Request Body (JSON):** Fields from `CashLendingSubscriptionPlans` table (name, price, duration_days required).
    *   **Success Response (201 Created):** Created plan object.
*   **2. List Subscription Plans (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/cash-lending/plans`
    *   **Query Parameters:** `page`, `limit`, `is_active`
    *   **Success Response (200 OK):** Paginated list of plans.
*   **3. Get Subscription Plan by ID**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/cash-lending/plans/{plan_id}`
    *   **Success Response (200 OK):** Plan object.
*   **4. Update Subscription Plan**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/cash-lending/plans/{plan_id}`
    *   **Request Body (JSON):** Fields from `CashLendingSubscriptionPlans` table to update.
    *   **Success Response (200 OK):** Updated plan object.
*   **5. Delete Subscription Plan**
    *   **HTTP Method:** `DELETE`
    *   **Path:** `/api/admin/cash-lending/plans/{plan_id}`
    *   **Success Response (204 No Content):**
    *   **Note:** Consider soft delete (`is_active = false`).

### Static Content Management (CRUD)
*   **1. Create Static Content**
    *   **HTTP Method:** `POST`
    *   **Path:** `/api/admin/content`
    *   **Request Body (JSON):** Fields from `StaticContent` table (slug, title, content_body required).
    *   **Success Response (201 Created):** Created content object.
*   **2. List Static Content (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/content`
    *   **Query Parameters:** `page`, `limit`, `is_published`
    *   **Success Response (200 OK):** Paginated list of content items.
*   **3. Get Static Content by ID (Admin)**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/content/{content_id}`
    *   **Success Response (200 OK):** Content object.
*   **4. Update Static Content**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/content/{content_id}`
    *   **Request Body (JSON):** Fields from `StaticContent` table to update. `last_updated_by` should be set to the admin's `user_id`.
    *   **Success Response (200 OK):** Updated content object.
*   **5. Delete Static Content**
    *   **HTTP Method:** `DELETE`
    *   **Path:** `/api/admin/content/{content_id}`
    *   **Success Response (204 No Content):**

### Enquiries Management
*   **1. List Enquiries**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/enquiries`
    *   **Query Parameters:** `page`, `limit`, `status`, `assigned_to_user_id`
    *   **Success Response (200 OK):** Paginated list of enquiry objects.
*   **2. Get Enquiry by ID**
    *   **HTTP Method:** `GET`
    *   **Path:** `/api/admin/enquiries/{enquiry_id}`
    *   **Success Response (200 OK):** Enquiry object.
*   **3. Update Enquiry (e.g., assign, change status)**
    *   **HTTP Method:** `PUT`
    *   **Path:** `/api/admin/enquiries/{enquiry_id}`
    *   **Request Body (JSON):**
        ```json
        {
          "status": "string (enum: 'new', 'in_progress', 'resolved', 'closed')",
          "assigned_to_user_id": "uuid (nullable, admin user_id)"
        }
        ```
    *   **Success Response (200 OK):** Updated enquiry object.
```
