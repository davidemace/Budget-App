import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';


const router = express.Router();

// Mock data (replace with database queries in a real application)
const users = [
    {
        sourcedId: '1',
        status: 'active',
        dateLastModified: '2023-01-01T00:00:00Z',
        metadata: {},
        username: 'john.doe',
        enabledUser: true,
        givenName: 'John',
        familyName: 'Doe',
        role: 'student',
        email: 'john.doe@example.com',
        sms: '',
        phone: '',
        agents: [],
        orgs: [
            {
                href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/2',
                sourcedId: '2',
                type: 'org'
            }
        ],
        grades: ['9'],
        password: ''
    },
    {
        sourcedId: '2',
        status: 'active',
        dateLastModified: '2023-01-01T00:00:00Z',
        metadata: {},
        username: 'jane.smith',
        enabledUser: true,
        givenName: 'Jane',
        familyName: 'Smith',
        role: 'teacher',
        email: 'jane.smith@example.com',
        sms: '',
        phone: '',
        agents: [],
        orgs: [
            {
                href: 'https://davidmace.us/ims/oneroster/v1p1/orgs/2',
                sourcedId: '2',
                type: 'org'
            }
        ],
        grades: [],
        password: ''
    }
];

const getUsers = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedUsers = users.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        users: paginatedUsers,
    });
};


// Register the route with the correct type signatures
router.get('/', getUsers);






// Get a specific user
router.get('/:id', (req, res) => {
    const user = users.find(u => u.sourcedId === req.params.id);
    if (user) {
        const response = oneRosterResponse(user, 'user');
        res.json(response);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

export const usersRouter = router;
