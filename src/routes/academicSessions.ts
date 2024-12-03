import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const academicSessions = [
    { sourcedId: '2023', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: '2023-2024 School Year', type: 'schoolYear', startDate: '2023-09-01', endDate: '2024-06-30', schoolYear: '2025', parent: null },
    { sourcedId: '1', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: 'Fall Semester 2023', type: 'term', startDate: '2023-09-01', endDate: '2023-12-20', schoolYear: '2025', parent: { sourcedId: '2023', href: 'https://davidmace.us/ims/oneroster/v1p1/academicSessions/2023' } },
];

const getSessions = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedSessions = academicSessions.slice(offset, offset + limit);

 // Respond without pagination metadata
    res.json({
        academicSessions: paginatedSessions,
    });
};


// Register the route with the correct type signatures
router.get('/', getSessions);

// Get a specific academic session
router.get('/:id', (req, res) => {
    const session = academicSessions.find(s => s.sourcedId === req.params.id);
    if (session) {
        const response = oneRosterResponse(session, 'academicSession');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Academic session not found' });
    }
});

export const academicSessionsRouter = router;

