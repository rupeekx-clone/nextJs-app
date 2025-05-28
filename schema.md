## Database Schema

### Users Table

Stores information about all users of the platform, including customers, cash lending customers, and administrators.

| Column Name         | Data Type            | Constraints                                                                 | Description                                                                 |
| ------------------- | -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `user_id`           | UUID                 | PRIMARY KEY                                                                 | Unique identifier for the user (auto-generated).                            |
| `full_name`         | VARCHAR(255)         | NOT NULL                                                                    | Full name of the user.                                                      |
| `email`             | VARCHAR(255)         | UNIQUE, NOT NULL                                                            | Email address of the user (validated).                                      |
| `phone_number`      | VARCHAR(20)          | UNIQUE, NOT NULL                                                            | Phone number of the user (validated).                                       |
| `password_hash`     | VARCHAR(255)         | NOT NULL                                                                    | Hashed password for user authentication.                                    |
| `address_line1`     | VARCHAR(255)         |                                                                             | First line of the user's address.                                           |
| `address_line2`     | VARCHAR(255)         |                                                                             | Second line of the user's address.                                          |
| `city`              | VARCHAR(100)         |                                                                             | City of the user's address.                                                 |
| `pincode`           | VARCHAR(10)          |                                                                             | Pincode of the user's address (validated for Indian pincodes).              |
| `user_type`         | ENUM('customer', 'cash_lending_customer', 'admin') | NOT NULL, DEFAULT 'customer'                                                | Type of user.                                                               |
| `email_verified_at` | TIMESTAMP            | NULLABLE                                                                    | Timestamp when the user's email was verified.                               |
| `phone_verified_at` | TIMESTAMP            | NULLABLE                                                                    | Timestamp when the user's phone number was verified.                        |
| `created_at`        | TIMESTAMP            | NOT NULL, DEFAULT NOW()                                                     | Timestamp of when the user account was created (auto-generated).            |
| `updated_at`        | TIMESTAMP            | NOT NULL, DEFAULT NOW()                                                     | Timestamp of the last update to the user account (auto-generated).          |

---

### LoanApplications Table

Stores details of loan applications submitted by users.

| Column Name              | Data Type            | Constraints                                                                                                | Description                                                                                                |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `application_id`         | UUID                 | PRIMARY KEY                                                                                                | Unique identifier for the loan application (auto-generated).                                               |
| `user_id`                | UUID                 | NOT NULL, FOREIGN KEY REFERENCES Users(user_id)                                                            | Identifier of the user who submitted the application.                                                      |
| `loan_type`              | ENUM('personal', 'business') | NOT NULL                                                                                                 | Type of loan requested.                                                                                    |
| `amount_requested`       | DECIMAL(15,2)        | NOT NULL                                                                                                   | Amount of loan requested by the user (must be positive).                                                   |
| `amount_approved`        | DECIMAL(15,2)        | NULLABLE                                                                                                   | Amount of loan approved by the admin/bank (must be positive).                                              |
| `interest_rate_proposed` | DECIMAL(5,2)         | NULLABLE                                                                                                   | Proposed interest rate for the loan (percentage).                                                          |
| `interest_rate_final`    | DECIMAL(5,2)         | NULLABLE                                                                                                   | Final interest rate agreed upon for the loan (percentage).                                                 |
| `tenure_months_requested`| INTEGER              | NOT NULL                                                                                                   | Requested loan tenure in months (must be positive).                                                        |
| `tenure_months_final`    | INTEGER              | NULLABLE                                                                                                   | Final loan tenure in months (must be positive).                                                            |
| `status`                 | ENUM('draft', 'submitted', 'under_review', 'requires_documents', 'approved', 'rejected', 'disbursed', 'closed', 'cancelled') | NOT NULL, DEFAULT 'draft'                                                                                  | Current status of the loan application.                                                                    |
| `bank_partner_id`        | UUID                 | NULLABLE, FOREIGN KEY REFERENCES BankPartners(bank_partner_id)                                             | Identifier of the bank partner associated with the loan, if any.                                           |
| `application_date`       | TIMESTAMP            | NOT NULL, DEFAULT NOW()                                                                                      | Date when the loan application was submitted.                                                              |
| `documents_submitted`    | JSONB                | NULLABLE                                                                                                   | JSON object storing URLs or references to submitted documents (e.g., `{"pan_card": "url", "aadhaar": "url"}`). |
| `admin_remarks`          | TEXT                 | NULLABLE                                                                                                   | Remarks or notes from the administrator regarding the application.                                         |
| `approved_at`            | TIMESTAMP            | NULLABLE                                                                                                   | Timestamp when the loan application was approved.                                                          |
| `disbursed_at`           | TIMESTAMP            | NULLABLE                                                                                                   | Timestamp when the loan amount was disbursed.                                                              |
| `created_at`             | TIMESTAMP            | NOT NULL, DEFAULT NOW()                                                                                      | Timestamp of when the application record was created (auto-generated).                                     |
| `updated_at`             | TIMESTAMP            | NOT NULL, DEFAULT NOW()                                                                                      | Timestamp of the last update to the application record (auto-generated).                                   |

**Indexes:**
*   `user_id`
*   `status`

---

### MembershipCardTypes Table

Stores information about the different types of membership cards available (e.g., Silver, Gold).

| Column Name                | Data Type     | Constraints                               | Description                                                                    |
| -------------------------- | ------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| `card_type_id`             | UUID          | PRIMARY KEY                               | Unique identifier for the membership card type (auto-generated).               |
| `name`                     | VARCHAR(255)  | UNIQUE, NOT NULL                          | Name of the membership card type (e.g., "Silver Membership Card").             |
| `description`              | TEXT          | NULLABLE                                  | Detailed description of the membership card type.                              |
| `price`                    | DECIMAL(10,2) | NOT NULL                                  | Price of the membership card (must be positive).                               |
| `validity_months`          | INTEGER       | NOT NULL                                  | Validity period of the card in months (must be positive).                      |
| `benefits_description`     | TEXT          | NOT NULL                                  | Description of the benefits associated with this card type.                    |
| `loan_type_association`    | ENUM('personal', 'business', 'any') | NULLABLE            | Specifies if the card benefits are associated with a particular loan type.     |
| `max_loan_amount_benefit`  | DECIMAL(15,2) | NULLABLE                                  | Maximum loan amount benefit associated with the card.                          |
| `processing_time_benefit`  | VARCHAR(50)   | NULLABLE                                  | Benefit related to loan processing time (e.g., "30 minutes", "48 hours").    |
| `is_active`                | BOOLEAN       | NOT NULL, DEFAULT TRUE                    | Flag indicating if this card type is currently active and available for purchase. |
| `created_at`               | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of when the card type was created (auto-generated).                  |
| `updated_at`               | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of the last update to the card type (auto-generated).                |

---

### MembershipCards Table

Stores information about membership cards purchased by users.

| Column Name          | Data Type     | Constraints                                                                               | Description                                                                    |
| -------------------- | ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `membership_card_id` | UUID          | PRIMARY KEY                                                                               | Unique identifier for the membership card instance (auto-generated).           |
| `user_id`            | UUID          | NOT NULL, UNIQUE, FOREIGN KEY REFERENCES Users(user_id)                                   | Identifier of the user who owns the card. UNIQUE ensures one active card per user. |
| `card_type_id`       | UUID          | NOT NULL, FOREIGN KEY REFERENCES MembershipCardTypes(card_type_id)                        | Identifier of the type of membership card.                                     |
| `purchase_date`      | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                   | Date when the membership card was purchased.                                   |
| `expiry_date`        | TIMESTAMP     | NOT NULL                                                                                  | Date when the membership card expires.                                         |
| `payment_id`         | VARCHAR(255)  | NULLABLE                                                                                  | Reference to the payment transaction for this card purchase.                   |
| `status`             | ENUM('active', 'expired', 'cancelled') | NOT NULL, DEFAULT 'active'                                         | Current status of the membership card.                                         |
| `benefits_availed`   | JSONB         | NULLABLE                                                                                  | JSON object storing details of benefits availed using this card.               |
| `created_at`         | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                   | Timestamp of when the card record was created (auto-generated).                |
| `updated_at`         | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                   | Timestamp of the last update to the card record (auto-generated).              |

**Indexes:**
*   `user_id`

---

### CashLendingSubscriptionPlans Table

Stores details about different subscription plans for cash lending services.

| Column Name     | Data Type     | Constraints                               | Description                                                              |
| --------------- | ------------- | ----------------------------------------- | ------------------------------------------------------------------------ |
| `plan_id`       | UUID          | PRIMARY KEY                               | Unique identifier for the subscription plan (auto-generated).            |
| `name`          | VARCHAR(255)  | UNIQUE, NOT NULL                          | Name of the subscription plan.                                           |
| `description`   | TEXT          | NULLABLE                                  | Detailed description of the subscription plan.                           |
| `price`         | DECIMAL(10,2) | NOT NULL                                  | Price of the subscription plan (must be positive).                       |
| `duration_days` | INTEGER       | NOT NULL                                  | Duration of the subscription in days (must be positive).                 |
| `features`      | JSONB         | NULLABLE                                  | JSON object describing the features included in the plan.                |
| `is_active`     | BOOLEAN       | NOT NULL, DEFAULT TRUE                    | Flag indicating if this plan is currently active and available.          |
| `created_at`    | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of when the plan was created (auto-generated).                 |
| `updated_at`    | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of the last update to the plan (auto-generated).               |

---

### CashLendingSubscriptions Table

Stores information about user subscriptions to cash lending plans.

| Column Name            | Data Type     | Constraints                                                                                      | Description                                                                      |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `subscription_id`      | UUID          | PRIMARY KEY                                                                                      | Unique identifier for the subscription instance (auto-generated).                |
| `user_id`              | UUID          | NOT NULL, UNIQUE, FOREIGN KEY REFERENCES Users(user_id)                                          | Identifier of the user who subscribed. UNIQUE ensures one active subscription.   |
| `subscription_plan_id` | UUID          | NOT NULL, FOREIGN KEY REFERENCES CashLendingSubscriptionPlans(plan_id)                             | Identifier of the cash lending subscription plan.                                |
| `start_date`           | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                          | Date when the subscription starts.                                               |
| `end_date`             | TIMESTAMP     | NOT NULL                                                                                         | Date when the subscription ends.                                                 |
| `payment_id`           | VARCHAR(255)  | NULLABLE                                                                                         | Reference to the payment transaction for this subscription.                      |
| `status`               | ENUM('active', 'expired', 'cancelled', 'grace_period') | NOT NULL, DEFAULT 'active'                                 | Current status of the subscription.                                              |
| `created_at`           | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                          | Timestamp of when the subscription record was created (auto-generated).          |
| `updated_at`           | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                                          | Timestamp of the last update to the subscription record (auto-generated).        |

**Indexes:**
*   `user_id`

---

### BankPartners Table

Stores information about bank partners involved in the loan process.

| Column Name            | Data Type     | Constraints                               | Description                                                                 |
| ---------------------- | ------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| `bank_partner_id`      | UUID          | PRIMARY KEY                               | Unique identifier for the bank partner (auto-generated).                    |
| `name`                 | VARCHAR(255)  | UNIQUE, NOT NULL                          | Name of the bank partner.                                                   |
| `logo_url`             | VARCHAR(2048) | NULLABLE                                  | URL of the bank partner's logo (validated URL).                             |
| `contact_person_name`  | VARCHAR(255)  | NULLABLE                                  | Name of the contact person at the bank.                                     |
| `contact_person_email` | VARCHAR(255)  | NULLABLE                                  | Email of the contact person (validated email).                              |
| `contact_person_phone` | VARCHAR(20)   | NULLABLE                                  | Phone number of the contact person.                                         |
| `is_active`            | BOOLEAN       | NOT NULL, DEFAULT TRUE                    | Flag indicating if the partnership is currently active.                     |
| `created_at`           | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of when the bank partner record was created (auto-generated).     |
| `updated_at`           | TIMESTAMP     | NOT NULL, DEFAULT NOW()                   | Timestamp of the last update to the bank partner record (auto-generated).   |

---

### Enquiries Table

Stores details of enquiries made by users or visitors.

| Column Name             | Data Type     | Constraints                                                                | Description                                                                  |
| ----------------------- | ------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `enquiry_id`            | UUID          | PRIMARY KEY                                                                | Unique identifier for the enquiry (auto-generated).                          |
| `name`                  | VARCHAR(255)  | NOT NULL                                                                   | Name of the person making the enquiry.                                       |
| `email`                 | VARCHAR(255)  | NOT NULL                                                                   | Email address of the enquirer (validated email).                             |
| `phone_number`          | VARCHAR(20)   | NOT NULL                                                                   | Phone number of the enquirer.                                                |
| `subject`               | VARCHAR(255)  | NULLABLE                                                                   | Subject of the enquiry.                                                      |
| `message`               | TEXT          | NOT NULL                                                                   | The content of the enquiry message.                                          |
| `status`                | ENUM('new', 'in_progress', 'resolved', 'closed') | NOT NULL, DEFAULT 'new'                  | Current status of the enquiry.                                               |
| `assigned_to_user_id`   | UUID          | NULLABLE, FOREIGN KEY REFERENCES Users(user_id)                            | Identifier of the admin user assigned to handle this enquiry.                |
| `created_at`            | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                    | Timestamp of when the enquiry was submitted (auto-generated).                |
| `updated_at`            | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                                    | Timestamp of the last update to the enquiry (auto-generated).                |

**Indexes:**
*   `status`
*   `assigned_to_user_id`

---

### StaticContent Table

Stores manageable static content for the website like FAQs, Terms & Conditions, Privacy Policy, etc.

| Column Name        | Data Type     | Constraints                                                       | Description                                                                                        |
| ------------------ | ------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `content_id`       | UUID          | PRIMARY KEY                                                       | Unique identifier for the static content item (auto-generated).                                    |
| `slug`             | VARCHAR(255)  | UNIQUE, NOT NULL                                                  | URL-friendly slug for accessing the content (e.g., 'faq', 'privacy-policy').                     |
| `title`            | VARCHAR(255)  | NOT NULL                                                          | Title of the content page.                                                                         |
| `content_body`     | TEXT          | NOT NULL                                                          | Main body of the static content (can be HTML, Markdown, or plain text).                            |
| `meta_description` | VARCHAR(500)  | NULLABLE                                                          | SEO meta description for the content page.                                                         |
| `last_updated_by`  | UUID          | NULLABLE, FOREIGN KEY REFERENCES Users(user_id)                   | Identifier of the admin user who last updated this content.                                        |
| `is_published`     | BOOLEAN       | NOT NULL, DEFAULT TRUE                                            | Flag indicating if the content is published and visible on the site.                               |
| `created_at`       | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                           | Timestamp of when the content item was created (auto-generated).                                   |
| `updated_at`       | TIMESTAMP     | NOT NULL, DEFAULT NOW()                                           | Timestamp of the last update to the content item (auto-generated).                                 |

---

## Table Relationships

*   **`Users` to `LoanApplications`**: One-to-Many (One user can have multiple loan applications).
    *   `LoanApplications.user_id` -> `Users.user_id`
*   **`Users` to `MembershipCards`**: One-to-One (One user has one active membership card, based on UNIQUE constraint on `user_id`). If multiple cards (even of different types, or historical) are allowed per user, this becomes One-to-Many and the UNIQUE constraint on `MembershipCards.user_id` should be removed.
    *   `MembershipCards.user_id` -> `Users.user_id`
*   **`MembershipCardTypes` to `MembershipCards`**: One-to-Many (One card type can be associated with many individual membership cards).
    *   `MembershipCards.card_type_id` -> `MembershipCardTypes.card_type_id`
*   **`Users` to `CashLendingSubscriptions`**: One-to-One (One user has one active cash lending subscription, based on UNIQUE constraint on `user_id`).
    *   `CashLendingSubscriptions.user_id` -> `Users.user_id`
*   **`CashLendingSubscriptionPlans` to `CashLendingSubscriptions`**: One-to-Many (One subscription plan can be subscribed to by many users).
    *   `CashLendingSubscriptions.subscription_plan_id` -> `CashLendingSubscriptionPlans.plan_id`
*   **`BankPartners` to `LoanApplications`**: One-to-Many (One bank partner can be associated with multiple loan applications).
    *   `LoanApplications.bank_partner_id` -> `BankPartners.bank_partner_id`
*   **`Users` to `Enquiries` (Assigned User)**: One-to-Many (One admin user can be assigned to multiple enquiries).
    *   `Enquiries.assigned_to_user_id` -> `Users.user_id`
*   **`Users` to `StaticContent` (Last Updated By)**: One-to-Many (One admin user can update multiple static content pages).
    *   `StaticContent.last_updated_by` -> `Users.user_id`

This markdown file defines the schema for all the tables, including column names, data types, constraints, and descriptions. It also includes a section on table relationships.
I've used generic SQL types and included all specified indexes and ENUM values.
The `MembershipCards.user_id` has a UNIQUE constraint as per the initial instruction, implying one active card per user. If the intention is to allow multiple cards (e.g., historical or different types simultaneously), this constraint should be removed.
The `LoanApplications.amount_requested` and `amount_approved` are `DECIMAL(15,2)` to accommodate larger loan amounts. `interest_rate` fields are `DECIMAL(5,2)`. Prices are `DECIMAL(10,2)`. These can be adjusted based on specific requirements.
I have also included the `BankPartners` table as it was referenced in `LoanApplications`.
I believe this covers all the requirements.
