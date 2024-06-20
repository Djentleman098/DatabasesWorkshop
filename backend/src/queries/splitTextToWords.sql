WITH RecursiveSplit (original_text, word, remaining_text) AS (
  SELECT 
    TEXT_DATA AS original_text,
    SUBSTR(TEXT_DATA, 1, INSTR(TEXT_DATA, ' ', 1, 1) - 1) AS word,
    SUBSTR(TEXT_DATA, INSTR(TEXT_DATA, ' ', 1, 1) + 1) AS remaining_text
  FROM TEXTS
  WHERE TEXT_DATA IS NOT NULL
  AND TEXT_ID = :textId
  
  UNION ALL
  
  SELECT 
    original_text,
    CASE 
      WHEN INSTR(remaining_text, ' ', 1, 1) > 0 THEN SUBSTR(remaining_text, 1, INSTR(remaining_text, ' ', 1, 1) - 1)
      ELSE remaining_text
    END AS word,
    CASE 
      WHEN INSTR(remaining_text, ' ', 1, 1) > 0 THEN SUBSTR(remaining_text, INSTR(remaining_text, ' ', 1, 1) + 1)
      ELSE NULL
    END AS remaining_text
  FROM RecursiveSplit
  WHERE remaining_text IS NOT NULL
)
SELECT word
FROM RecursiveSplit