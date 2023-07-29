// https://stackoverflow.com/questions/68767798/how-to-deploy-sveltekit-app-in-node-server-with-https
import { handler } from "../build/handler.js";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";

const privateKey = fs.readFileSync("ssl/server.key", "utf8");
const certificate = fs.readFileSync("ssl/server.crt", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
};

const app = express();

const PORT = 8080;
const SSLPORT = 8443;

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(PORT, function () {
  console.log("HTTP Server is running on: http://localhost:" + PORT);
});

httpsServer.listen(SSLPORT, function () {
  console.log("HTTPS Server is running on: https://localhost:" + SSLPORT);
});

// add a route that lives separately from the SvelteKit app
app.get("/healthcheck", (req, res) => {
  res.end("ok");
});

// let SvelteKit handle everything else, including serving prerendered pages and static assets
app.use(handler);
