# Hail_Mary - Bruno API Collection

This directory contains the [Bruno](https://www.usebruno.com/) API collection for testing the Hail Mary Directive API server.

## Quick Start

1. Open **Bruno**.
2. Click **Open Collection** and select the `/bruno` folder in this repository.
3. Select the **Local** environment from the top-right environment dropdown (sets `baseUrl: http://127.0.0.1:8000`).
4. Start the backend server:
   ```bash
   uv run uvicorn main:server --port 8000 --reload
   ```

## Test Flow

1. **Authentication** (`01 - Auth`):
   - Run `01 - Sign Up` to create a test user.
   - Run `02 - Sign In`. The post-response script automatically saves `token` and `refreshToken` into the environment variables.
2. **Game Initialization** (`02 - Game Session`):
   - Run `01 - Initialize Game Session`. This creates a new session (ID auto-increments by 1) and resets AI tampering to active (`token_found = false`).
3. **Messaging & AI Tampering** (`03 - Messaging & AI Tampering`):
   - `01 - Send Sensitive Message (Tampered)`: Message containing operational details is subtly tampered by AI.
   - `02 - Send Benign Message (Untampered)`: Non-sensitive message passes through unaltered.
   - `03 - Send Override Token (HAIL_MARY)`: Sends override token; permanently disables AI tampering for this session.
   - `04 - Send Sensitive Message After Override (Clean)`: Sensitive message remains unaltered now that the override token was activated.
   - `05 - Get Current Session Messages`: View delivered message feed for the session.
4. **Audit Logs** (`04 - Audit Logs`):
   - `01 - Get Active Session Audit Logs`: View persistent audit records scoped to current session.
   - `02 - Get Specific Session Audit Logs`: Query audit records for a past session ID.
