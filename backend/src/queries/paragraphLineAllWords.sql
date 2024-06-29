WITH CLOB_DATA AS (
  SELECT TEXT_ID AS ID, 
         UTL_RAW.CAST_TO_VARCHAR2(DBMS_LOB.SUBSTR(TEXT_DATA, DBMS_LOB.GETLENGTH(TEXT_DATA), 1)) AS CLOB_TEXT
  FROM TEXTS
),
PARAGRAPH_SPLIT AS (
    SELECT ID,
        REGEXP_SUBSTR(CLOB_TEXT,'(.*?)(' || CHR(10)||CHR(13)||'|$)', 1, LEVEL, 'n', 1) AS PARAGRAPH,
           LEVEL AS PARAGRAPH_NUM
    FROM CLOB_DATA
    CONNECT BY PRIOR ID = ID
           AND PRIOR DBMS_RANDOM.VALUE IS NOT NULL
           AND LEVEL < REGEXP_COUNT(CLOB_TEXT, '(.*?)(' || CHR(10)||CHR(13)||'|$)')
),
LINE_SPLIT AS (
  SELECT ID,
         PARAGRAPH,
         PARAGRAPH_NUM,
         REGEXP_SUBSTR(PARAGRAPH, '([^' || CHR(10) || '.]+[.' || CHR(10) || ']?)', 1, LEVEL) AS LINE,
         LEVEL AS LINE_NUM
  FROM PARAGRAPH_SPLIT
  CONNECT BY PRIOR ID = ID
         AND PRIOR PARAGRAPH_NUM = PARAGRAPH_NUM
         AND PRIOR SYS_GUID() IS NOT NULL
         AND REGEXP_SUBSTR(PARAGRAPH, '([^' || CHR(10) || '.]+[.' || CHR(10) || ']?)', 1, LEVEL) IS NOT NULL
),
WORD_SPLIT AS (
  SELECT ID, 
         PARAGRAPH_NUM,
         LINE_NUM, 
         LINE,
         REGEXP_SUBSTR(LINE, '[^[:space:]]+', 1, LEVEL) AS WORD, 
         LEVEL AS WORD_POS
  FROM LINE_SPLIT
  CONNECT BY PRIOR ID = ID 
         AND PRIOR PARAGRAPH_NUM = PARAGRAPH_NUM
         AND PRIOR LINE_NUM = LINE_NUM 
         AND PRIOR dbms_random.value IS NOT NULL 
         AND LEVEL <= LENGTH(LINE) - LENGTH(REPLACE(LINE, ' ', '')) + 1
),
PARAGRAPH_ORDER AS(
    SELECT
    ID,
    PARAGRAPH_NUM,
    ROW_NUMBER() OVER (PARTITION BY ID ORDER BY PARAGRAPH_NUM) AS FIXED_PARAGRAPH_NUM
    FROM PARAGRAPH_SPLIT
    WHERE PARAGRAPH IS NOT NULL
),
LINE_ORDER AS(
    SELECT
    ID,
    PARAGRAPH_NUM,
    LINE_NUM,
    ROW_NUMBER() OVER (PARTITION BY ID,  PARAGRAPH_NUM ORDER BY LINE_NUM) AS FIXED_LINE_NUM,
    LENGTH(TRIM(LINE)) AS LEN
    FROM LINE_SPLIT
    WHERE LINE IS NOT NULL AND LENGTH(TRIM(LINE)) > 0
)
SELECT
  WORD_SPLIT.ID AS TEXT_ID,
  WORD_SPLIT.WORD,
  PARAGRAPH_ORDER.FIXED_PARAGRAPH_NUM AS PARAGRAPH_NUM,
  LINE_ORDER.FIXED_LINE_NUM AS LINE_NUM,
  WORD_SPLIT.WORD_POS
FROM WORD_SPLIT
LEFT JOIN PARAGRAPH_ORDER ON PARAGRAPH_ORDER.ID = WORD_SPLIT.ID AND PARAGRAPH_ORDER.PARAGRAPH_NUM = WORD_SPLIT.PARAGRAPH_NUM
LEFT JOIN LINE_ORDER ON LINE_ORDER.ID = WORD_SPLIT.ID AND LINE_ORDER.PARAGRAPH_NUM = WORD_SPLIT.PARAGRAPH_NUM AND LINE_ORDER.LINE_NUM = WORD_SPLIT.LINE_NUM
WHERE WORD IS NOT NULL
AND WORD_SPLIT.ID IN (&textId)
ORDER BY WORD_SPLIT.ID, PARAGRAPH_ORDER.FIXED_PARAGRAPH_NUM, LINE_ORDER.FIXED_LINE_NUM, WORD_SPLIT.WORD_POS