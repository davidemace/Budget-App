import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const classes = [
    { sourcedId: '1', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: 'Math 101', grades: ['9'], subjects: ['Math'], course: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/courses/1' }, school: { sourcedId: '2', href: 'https://davidmace.us/ims/oneroster/v1p1/schools/2' }, terms: [{ sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/academicSessions/1' }], subjectCodes: [], periods: [], classType: 'scheduled', resources: [] },
    { sourcedId: '2', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: 'Math 102', grades: ['9'], subjects: ['Math'], course: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/courses/1' }, school: { sourcedId: '2', href: 'https://davidmace.us/ims/oneroster/v1p1/schools/2' }, terms: [{ sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/academicSessions/1' }], subjectCodes: [], periods: [], classType: 'scheduled', resources: [] },
];


const getClasses = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedClasses = classes.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        classes: paginatedClasses,
    });
};


// Register the route with the correct type signatures
router.get('/', getClasses);

// Get a specific class
router.get('/:id', (req, res) => {
    const classObj = classes.find(c => c.sourcedId === req.params.id);
    if (classObj) {
        const response = oneRosterResponse(classObj, 'class');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Class not found' });
    }
});

export const classesRouter = router;

