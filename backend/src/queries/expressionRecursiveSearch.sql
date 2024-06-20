WITH RecursiveSearch (TEXT_DATA, occurrence, position) AS (
  SELECT TEXT_DATA, 
         1 AS occurrence,
         INSTR(TEXT_DATA, :expression, 1, 1) AS position
  FROM TEXTS
  WHERE INSTR(TEXT_DATA, :expression, 1, 1) > 0
  AND TEXT_ID = :textId
  
  UNION ALL
  
  SELECT TEXT_DATA,
         occurrence + 1,
         INSTR(TEXT_DATA, :expression, position + 1, 1)
  FROM RecursiveSearch
  WHERE INSTR(TEXT_DATA, :expression, position + 1, 1) > 0
)
SELECT position
FROM RecursiveSearch