import express, { Request, Response } from 'express';
import { oneRosterResponse } from '../utils/oneRosterResponse';

const router = express.Router();

// Mock data (replace with database queries in a real application)
const demographics = [
    { sourcedId: '1', status: 'active', dateLastModified: '2023-01-01T00:00:00Z', metadata: {}, birthDate: '2005-05-15', sex: 'male', americanIndianOrAlaskaNative: false, asian: false, blackOrAfricanAmerican: false, nativeHawaiianOrOtherPacificIslander: false, white: true, demographicRaceTwoOrMoreRaces: false, hispanicOrLatinoEthnicity: false, countryOfBirthCode: 'US', stateOfBirthAbbreviation: 'CA', cityOfBirth: 'Los Angeles', publicSchoolResidenceStatus: '01' },
];

const getDemographics = (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedDemographics = demographics.slice(offset, offset + limit);

    // Respond without the pagination data
    res.json({
        demographics: paginatedDemographics,
    });
};


// Register the route with the correct type signatures
router.get('/', getDemographics);

// Get a specific demographic
router.get('/:id', (req, res) => {
    const demographic = demographics.find(d => d.sourcedId === req.params.id);
    if (demographic) {
        const response = oneRosterResponse(demographic, 'demographic');
        res.json(response);
    } else {
        res.status(404).json({ error: 'Demographic not found' });
    }
});

export const demographicsRouter = router;

