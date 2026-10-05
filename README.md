# Contact Form Backend

A simple contact form backend built using **Node.js, Express.js, Nodemailer, Gmail SMTP, and SQLite**.

## Features

* Accepts name, email, and message
* Validates required fields and email format
* Forwards contact details to the configured email
* Stores submissions in SQLite
* Provides an endpoint to view stored submissions

## Technologies

* Node.js
* Express.js
* Nodemailer
* SQLite
* better-sqlite3
* dotenv
* Postman

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

Run the server:

```bash
node app.js
```

Server:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| POST   | `/contact`  | Submit contact form     |
| GET    | `/contacts` | View stored submissions |

### POST `/contact`

```json
{
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "message": "Hello, I want to contact you."
}
```

Successful response:

```json
{
    "success": true,
    "message": "email sent successfully",
    "id": 1
}
```

## Security

Email credentials are stored in `.env` and should not be uploaded to GitHub.

Add these to `.gitignore`:

```text
node_modules/
.env
contacts.db
```

## Testing

The API was tested using **Postman**, including valid submissions, missing fields, invalid emails, email forwarding, and database storage.
