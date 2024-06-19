export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text?: string; // Optional for plain text emails
  html?: string; // Optional for HTML emails
}
