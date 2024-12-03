import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const organizations = [
    { sourcedId: '1', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, name: 'Sample School District', type: 'district', identifier: 'SSD-001', parent: null },
    { sourcedId: '2', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, name: 'Sample High School', type: 'school', identifier: 'SHS-001', parent: { sourcedId: '1', href: '/orgs/1' } },
];

const getOrgs = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedOrgs = organizations.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        orgs: paginatedOrgs,
    });
};


// Register the route with the correct type signatures
router.get('/', getOrgs
);

// Get a specific organization
router.get('/:id', (req, res) => {
    const org = organizations.find(o => o.sourcedId === req.params.id);
    if (org) {
        const response = oneRosterResponse(org, 'org');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Organization not found' });
    }
});

export const organizationsRouter = router;

