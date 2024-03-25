const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.NODEMAILER_HOST,
	port: process.env.NODEMAILER_PORT,
	secure: process.env.NODEMAILER_SECURE,
	auth: {
		user: process.env.NODEMAILER_AUTH_USER,
		pass: process.env.NODEMAILER_AUTH_PASS,
	},
});

function generateVerificationToken() {
	return (
		Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
	);
}

async function sendVerificationEmail(email) {
	const mailOption = {
		from: process.env.NODEMAILER_AUTH_USER,
		to: email,
		subject: "Verification Email",
		html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email Address</title>
            <style>
                /* Optional styling for the email */
                body {
                font-family: sans-serif;
                margin: 0;
                padding: 0;
                }
                a {
                color: #3498db;
                text-decoration: none;
                }
            </style>
            </head>
            <body>
            <h1>Thanks for Signing Up!</h1>
            <p>Welcome to BingleShop, ${email}.</p>
            <p>To verify your email address and start enjoying all the benefits of our platform, please click the button below:</p>
            <a href="http://localhost:3000/api/v1/verify?email=${email}">Verify Your Email</a>
            <p>Thanks,</p>
            <p>The BingleShop Team</p>
            </body>
            </html>`,
	};

	try {
		await transporter.sendMail(mailOption);
		console.log("Verification email sent successfully");
	} catch (error) {
		console.log("Error sending verification email:", error.message);
	}
}

module.exports = { sendVerificationEmail, generateVerificationToken };
