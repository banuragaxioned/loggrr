# Working with timezones

## Different variables

- Database: UTC, eg: 2023-04-05T00:00:00.000Z (ISO-8601 format)
- Javascript/Typescript Date() defaults to 2023-04-05T00:00:00.000Z (ISO-8601 format)
- Frontend should accept UTC time for all post requests
  Frontend should show timezone 

## Notes

User log a time entry for 1st April 2023 at 4:00 AM IST for 1 hour.
User checks the report for 1st April 2023 in `Asia/Kolkata` timezone.
User sees the time logged for 1st April 2023 at 4:00 AM IST.

User checks the report for 1st April 2023 in `Europe/London` timezone.
User sees the time logged for 31st March 2023 at 10:30 PM BST.

This is what's happening on Tick, right now.

When client `Europe/London` checks for March report it should not show the time entries for 1st April 2023.


---
1. UTC time: 1:36am, 31st March 2023
2. Pacific time: 4:36pm, 31st March 2023
3. IST time: 7:06am, 1st April 2023
4. Melbourne time: 6:36pm, 1st April 2023

-- Hypothtical Scenario 
User Time
Timezone    : IST 
Date        : 31st March 
Time        : 8:00PM 

Reporter Time
Timezeone   : AEST
Date        : 1st April
Time        : 4:00 AM 

User 1 logs in hour from IST at 7:00 to 8:00 PM - 1 Hour
Reporter sees this entry in AEST instantly - when data is extracted createdAt will have value 2023-03-31T19:00:00+5:30 




