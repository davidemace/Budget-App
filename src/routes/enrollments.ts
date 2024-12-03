import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const enrollments = [
    {
        sourcedId: '1',
        status: 'active',
        dateLastModified: '2023-01-01T00:00:00Z',
        metadata: {},
        user: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/users/1' },
        class: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/classes/1' },
        school: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/1' },
        role: 'student',
        primary: true,
        beginDate: '2023-09-01',
        endDate: '2024-06-30',
    },
    {
        sourcedId: '2',
        status: 'active',
        dateLastModified: '2023-01-01T00:00:00Z',
        metadata: {},
        user: { sourcedId: '2', href: 'https://davidmace.us/ims/oneroster/v1p1/users/2' },
        class: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/classes/1' },
        school: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/1' },
        role: 'teacher',
        primary: true,
        beginDate: '2023-09-01',
        endDate: '2024-06-30',
    },
];


const getEnrollments = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedEnrollments = enrollments.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        enrollments: paginatedEnrollments,
    });
};


// Register the route with the correct type signatures
router.get('/', getEnrollments);

// Get a specific enrollment
router.get('/:id', (req, res) => {
    const enrollment = enrollments.find(e => e.sourcedId === req.params.id);
    if (enrollment) {
        const response = oneRosterResponse(enrollment, 'enrollment');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Enrollment not found' });
    }
});

export const enrollmentsRouter = router;

