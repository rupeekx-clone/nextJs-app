# Backend Documentation

Welcome to the backend documentation for the FinTech Loan and Membership Platform. This document serves as the central hub for understanding the database structure and the API endpoints that power the platform.

## Overview

The backend is responsible for managing user data, loan applications, membership subscriptions, and other core functionalities of the platform. It provides a RESTful API for client applications (web and mobile) to interact with the system.

## Key Documentation Files

1.  **Database Schema (`schema.md`)**:
    *   **Content**: This file provides a detailed description of the database structure, including all tables, their columns, data types, constraints (primary keys, foreign keys, unique constraints, etc.), and indexes. It also outlines the relationships between different tables.
    *   **How to Use**: Refer to this document when you need to understand the data model, how data is stored, or the meaning of specific fields in the database. This is crucial for backend developers working on database interactions and for anyone needing to understand the underlying data architecture.
    *   [View Database Schema](./schema.md)

2.  **API Endpoints (`api_endpoints.md`)**:
    *   **Content**: This document details all the available API endpoints. For each endpoint, it specifies the HTTP method, path, authentication requirements, request body structure (if any), success responses (including status codes and example payloads), and common error responses.
    *   **How to Use**: Use this guide to understand how to interact with the backend API. It's essential for frontend developers building client applications and for backend developers implementing or maintaining the API logic. Each endpoint group (e.g., Authentication, User Profile, Loan Applications) is clearly defined.
    *   [View API Endpoints](./api_endpoints.md)

3.  **OpenAPI Specification (`openapi.yaml`)**:
    *   **Content**: This file provides a machine-readable (and human-readable) definition of the API, following the OpenAPI 3.0 specification. It includes formal definitions for paths, operations, request/response schemas, security schemes, and more.
    *   **How to Use**: This specification can be used to:
        *   Automatically generate API client libraries in various programming languages.
        *   Import into API testing tools like Postman or Insomnia for easy request creation and testing.
        *   Serve as a precise contract for frontend-backend communication.
        *   Power interactive API documentation tools (e.g., Swagger UI, ReDoc).
    *   [View OpenAPI Specification](./openapi.yaml)

## General Guidelines for Using API Endpoints

*   **Authentication**: Most endpoints require a JWT (JSON Web Token) for authentication. The token should be included in the `Authorization` header as a Bearer token: `Authorization: Bearer <your_jwt_token>`.
*   **Request/Response Format**: All request and response bodies are in JSON format.
*   **Error Handling**: Standard HTTP status codes are used to indicate the success or failure of an API request. Error responses typically include a JSON body with an `error` message and sometimes a `details` object for validation errors.
*   **Validation**: Input data is validated. Ensure that your requests conform to the specified data types and constraints.
*   **Admin Endpoints**: Endpoints under `/api/admin/` are restricted to users with administrative privileges.

We strive to keep this documentation up-to-date. If you find any discrepancies or have suggestions for improvement, please reach out to the development team.
