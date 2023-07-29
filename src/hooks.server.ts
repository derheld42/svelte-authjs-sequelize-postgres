import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";

import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import SequelizeAdapter from "@auth/sequelize-adapter";
import { Sequelize } from "sequelize";
import {
  RDS_ENDPOINT,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  AUTH_SECRET,
} from "$env/static/private";
import {
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_HOST,
  SMTP_PORT,
  EMAIL_FROM,
} from "$env/static/private";
import EmailProvider from "@auth/core/providers/email";
import pg from "pg";

// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
// https://sequelize.org/docs/v6/other-topics/dialect-specific-things/
// https://sequelize.org/docs/v6/other-topics/dialect-specific-things/#postgresql
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: process.env.RDS_ENDPOINT ? process.env.RDS_ENDPOINT : RDS_ENDPOINT,
  dialect: "postgres",
  // https://github.com/sequelize/sequelize/issues/13169
  // Error: Could not dynamically require "pg".
  // Solution --> use dialectModule
  dialectModule: pg,
  // https://sequelize.org/docs/v6/getting-started/#logging
  logging: (...msg) => console.log(msg), // LOTS of Logging.
  //logging: (msg) => log.info(msg), // 1 line per log
  //logging: AUTH_DEBUG == 'true' || process.env.AUTH_DEBUG ? true : false // turn off logging.
});

// https://authjs.dev/reference/adapter/sequelize
const sql = SequelizeAdapter(sequelize);

// https://authjs.dev/getting-started/email-tutorial
const email = EmailProvider({
  server: {
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  },
  from: EMAIL_FROM,
});

export const handle: Handle = sequence(
  // This is dynamic so we can use environment variables at some point.
  SvelteKitAuth(async (event) => {
    const authOptions: SvelteKitAuthConfig = {
      providers: [email],
      secret: AUTH_SECRET,
      trustHost: true,

      adapter: sql,
      // https://authjs.dev/guides/basics/callbacks
      callbacks: {
        // Thread the auth.js user_id into session, so we can do something with it.
        session: async ({ session, user }) => {
          // https://stackoverflow.com/questions/70409219/get-user-id-from-session-in-next-auth-client
          session.user.id = user.id;
          return session;
        },
      },
      debug: true,
    };
    return authOptions;
  })
);
