import express from 'express';
import { config } from 'dotenv';
import fs from 'fs';
import https from 'https';
import { usersRouter } from './routes/users';
import { classesRouter } from './routes/classes';
import { errorHandler } from './middleware/errorHandler';
import { authenticateOAuth } from './middleware/auth';
import { coursesRouter } from './routes/courses';
import { enrollmentsRouter } from './routes/enrollments';
import { organizationsRouter } from './routes/organizations';
import { academicSessionsRouter } from './routes/academicSessions';
import { demographicsRouter } from './routes/demographics';

config(); // Load environment variables

const app = express();

app.use(express.json());

// Create a router for all OneRoster routes
const oneRosterRouter = express.Router();

// Apply OAuth authentication middleware to all OneRoster routes
oneRosterRouter.use(authenticateOAuth);

// OneRoster routes
oneRosterRouter.use('/users', usersRouter);
oneRosterRouter.use('/classes', classesRouter);
oneRosterRouter.use('/courses', coursesRouter);
oneRosterRouter.use('/enrollments', enrollmentsRouter);
oneRosterRouter.use('/orgs', organizationsRouter);
oneRosterRouter.use('/academicSessions', academicSessionsRouter);
oneRosterRouter.use('/demographics', demographicsRouter);

// Apply the OneRoster router to the main app
app.use('/ims/oneroster/v1p1', oneRosterRouter);

// Error handling middleware
app.use(errorHandler);

// Load SSL certificate and key
const httpsOptions = {
    key: fs.readFileSync('/home/Projects/Vercel/SSL/davidmace.key'), // Replace with your private key file path
    cert: fs.readFileSync('/home/Projects/Vercel/SSL/davidmace.crt'), // Replace with your certificate file path
    ca: fs.readFileSync('/home/Projects/Vercel/SSL/davidmace.ca-bundle')
};

// Start the HTTPS server
const PORT = process.env.PORT || 443;

https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`OneRoster 1.1 API server listening securely at https://localhost:${PORT}`);
});

export default app;
