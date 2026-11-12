# Server-side setup

The admin password-reset flow sends a one-hour reset link by email. Configure
these environment variables in the server deployment:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=Shaggar Admin <no-reply@example.com>
CLIENT_URL=https://your-client-domain.example
```

`SMTP_FROM` is optional and defaults to `SMTP_USER`. `CLIENT_URL` should be the
base URL of the deployed client; it is used for reset links and the server's CORS
allowlist, and defaults to `http://localhost:5173` outside production. Never
commit real SMTP credentials.

For local development only, if all SMTP variables are omitted, the server logs
the one-hour reset link in its terminal instead of sending email. Open that link
in the browser to complete the reset. Production always requires SMTP settings;
the reset token is never returned by the API.
