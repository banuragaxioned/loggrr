import net from "node:net";
import tls from "node:tls";
import nodemailer from "nodemailer";

interface SmtpConfig {
  host: string;
  port: number;
  auth: { user: string; pass: string };
}

export function createMailTransport({ host, port, auth }: SmtpConfig) {
  const secure = port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
    // Let the runtime connect by hostname. Nodemailer's automatic address
    // selection fails in Workers; its supported socket hook avoids that path.
    getSocket(_options, callback) {
      const options = { host, port, timeout: 15_000 };
      const socket = secure ? tls.connect({ ...options, servername: host }) : net.connect(options);
      const onError = (error: Error) => callback(error);
      const onTimeout = () => socket.destroy(new Error("SMTP connection timed out"));

      socket.once("error", onError);
      socket.once("timeout", onTimeout);
      socket.once(secure ? "secureConnect" : "connect", () => {
        socket.removeListener("error", onError);
        socket.removeListener("timeout", onTimeout);
        socket.setTimeout(0);
        callback(null, { connection: socket, secured: secure });
      });
    },
  });
}
