# Database

The database schema is illustrated in the entity relationship diagram below and the purpose of each table is described below.

```mermaid
erDiagram
  direction LR

  %% Tables

  Account {
    int id PK
    int userId FK
    string providerId
    string accountId
    string accessToken
    string refreshToken
    timestamp accessTokenExpiresAt
    timestamp refreshTokenExpiresAt
    string scope
    string idToken
    string password
    timestamp createdAt
    timestamp updatedAt
  }

  User {
    int id PK
    string email
    string name
    string image
    timestamp createdAt
    timestamp updatedAt
  }

  %% Relationships

  User ||--o{ Account : "1:n"
```

## Tables

### `Account`

Represents an account that is used to authenticate a [`User`](#user). Users may have multiple accounts with different providers, one for each provider. This allows users to log in with their preferred provider which could be local (i.e., username and password) or a social login (e.g., Google, GitHub, etc.).

### `User`

Represents an individual who signed up for and intends to use the application.
