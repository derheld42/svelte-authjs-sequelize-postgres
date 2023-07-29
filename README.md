# svelte-authjs-sequelize-postgres

This example was created to attempt to show a working svelte + auth.js + sequelize + postgres. However, when run in production mode, it doesn't work due to a "callback route error".

# Setup

First start with the beginnings of a .env file. 
```
cp .env.example .env
```

Then fill out the empty variables in .env - postgres for DB vars, sendgrid API key for SMTP.


Then run these:
```
npm install
npm run build
npm start
```

# Repro
- Go to https://localhost:8443/auth/signin
- Put in your email and submit.
- Check your spam folder and click link in email. You'll get a callback route error.