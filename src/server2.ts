import express from 'express';
import { createServer } from 'http';
import { config } from 'dotenv';
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
const httpServer = createServer(app);

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

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`OneRoster 1.1 API server listening at http://localhost:${PORT}`);
});

export default app;

