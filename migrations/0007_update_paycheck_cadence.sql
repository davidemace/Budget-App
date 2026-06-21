-- Align paycheck source rows with the real recurring cadence:
-- McGraw Hill on the 15th and last workday, WISD on the 24th.

UPDATE paychecks
SET name = 'McGraw Hill paycheck - 15th',
    notes = 'Recurring McGraw Hill paycheck paid on the 15th. Update net amount if current post-raise net is different.'
WHERE name IN ('McGraw Hill paycheck - first half', 'McGraw Hill paycheck - 15th');

UPDATE paychecks
SET name = 'McGraw Hill paycheck - last workday',
    notes = 'Recurring McGraw Hill paycheck paid on the last workday of the month.'
WHERE name IN ('McGraw Hill paycheck - second half', 'McGraw Hill paycheck - last workday');

UPDATE paychecks
SET name = 'WISD paycheck',
    pay_date = substr(pay_date, 1, 8) || '24',
    notes = 'Recurring WISD paycheck paid on the 24th.'
WHERE name IN ('Additional monthly check', 'WISD paycheck');
