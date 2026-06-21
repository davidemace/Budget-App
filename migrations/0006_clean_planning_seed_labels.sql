-- Rename planning assumptions so the app does not display unfinished placeholder labels.

UPDATE bills SET name = 'Estimated housing payment / rent'
WHERE name = 'Housing payment / rent placeholder';

UPDATE bills SET name = 'Estimated electric and gas'
WHERE name = 'Electric and gas placeholder';

UPDATE bills SET name = 'Estimated water and trash'
WHERE name = 'Water and trash placeholder';

UPDATE bills SET name = 'Estimated internet'
WHERE name = 'Internet placeholder';

UPDATE bills SET name = 'Estimated mobile phones'
WHERE name = 'Mobile phones placeholder';

UPDATE bills SET name = 'Estimated car insurance'
WHERE name = 'Car insurance placeholder';
