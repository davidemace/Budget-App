import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const courses = [
    { sourcedId: '1', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: 'Mathematics', schoolYear: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/academicSessions/1' }, courseCode: 'MATH101', grades: ['9'], subjects: ['Math'], subjectCodes: [], org: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/1' } },
    { sourcedId: '2', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, title: 'English Literature', schoolYear: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/academicSessions/1' }, courseCode: 'ENG101', grades: ['9'], subjects: ['English'], subjectCodes: [], org: { sourcedId: '1', href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/1' } },
];


const getCourses = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedCourses = courses.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        courses: paginatedCourses,
    });
};


// Register the route with the correct type signatures
router.get('/', getCourses);

// Get a specific course
router.get('/:id', (req, res) => {
    const course = courses.find(c => c.sourcedId === req.params.id);
    if (course) {
        const response = oneRosterResponse(course, 'course');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

export const coursesRouter = router;

