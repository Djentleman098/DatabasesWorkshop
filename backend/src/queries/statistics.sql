WITH CLOB_DATA AS (
  SELECT TEXT_ID AS ID, 
         UTL_RAW.CAST_TO_VARCHAR2(DBMS_LOB.SUBSTR(TEXT_DATA, DBMS_LOB.GETLENGTH(TEXT_DATA), 1)) AS CLOB_TEXT
  FROM TEXTS
  WHERE TEXT_ID = :id
),
LINE_SPLIT_RNC AS (
  SELECT ID,
         CLOB_TEXT,
         REGEXP_SUBSTR(CLOB_TEXT, '[^' || CHR(10) || ']+', 1, LEVEL) AS LINE,
         LEVEL AS LINE_NUM
  FROM CLOB_DATA
  CONNECT BY PRIOR ID = ID
         AND PRIOR dbms_random.value IS NOT NULL
         AND LEVEL <= LENGTH(CLOB_TEXT) - LENGTH(REPLACE(CLOB_TEXT, CHR(10), '')) + 1
),
WORD_SPLIT_RNC AS (
  SELECT ID, 
         LINE_NUM, 
         REGEXP_SUBSTR(LINE, '[^[:space:]]+', 1, LEVEL) AS WORD, 
         LEVEL AS WORD_POS, 
         LINE
  FROM LINE_SPLIT_RNC
  CONNECT BY PRIOR ID = ID 
         AND PRIOR LINE_NUM = LINE_NUM 
         AND PRIOR dbms_random.value IS NOT NULL 
         AND LEVEL <= LENGTH(LINE) - LENGTH(REPLACE(LINE, ' ', '')) + 1
),
WORD_SPLIT_RNC_ACCUR AS (
    SELECT ID,
         LINE_NUM,
         LINE,
         WORD_POS,
         WORD,
         ROW_NUMBER() OVER (PARTITION BY ID, WORD ORDER BY LINE_NUM, WORD_POS) AS WORD_OCCURRENCE_INDEX
  FROM WORD_SPLIT_RNC
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
LINE_SPLIT_PNL AS (
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
WORD_SPLIT_PNL AS (
  SELECT ID, 
         PARAGRAPH_NUM,
         LINE_NUM, 
         LINE,
         REGEXP_SUBSTR(LINE, '[^[:space:]]+', 1, LEVEL) AS WORD, 
         LEVEL AS WORD_POS
  FROM LINE_SPLIT_PNL
  CONNECT BY PRIOR ID = ID 
         AND PRIOR PARAGRAPH_NUM = PARAGRAPH_NUM
         AND PRIOR LINE_NUM = LINE_NUM 
         AND PRIOR dbms_random.value IS NOT NULL 
         AND LEVEL <= LENGTH(LINE) - LENGTH(REPLACE(LINE, ' ', '')) + 1
),
WORD_SPLIT_PNL_ACCUR AS (
         SELECT ID,
         PARAGRAPH_NUM,
         LINE_NUM,
         LINE,
         WORD_POS,
         WORD,
         ROW_NUMBER() OVER (PARTITION BY ID, WORD ORDER BY PARAGRAPH_NUM, LINE_NUM) AS WORD_OCCURRENCE_INDEX
  FROM WORD_SPLIT_PNL
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
    FROM LINE_SPLIT_PNL
    WHERE LINE IS NOT NULL AND LENGTH(TRIM(LINE)) > 0
),
WORD_COUNT AS(
SELECT
  WORD_SPLIT_RNC_ACCUR.ID,
  COUNT(WORD_SPLIT_RNC_ACCUR.WORD) AS WORD_COUNT
FROM WORD_SPLIT_RNC_ACCUR
GROUP BY WORD_SPLIT_RNC_ACCUR.ID
),
WORD_ACCUM AS(
SELECT
  WORD_SPLIT_RNC_ACCUR.ID,
  WORD_SPLIT_RNC_ACCUR.WORD,
  COUNT(WORD_SPLIT_RNC_ACCUR.WORD) AS WORD_ACCUM
FROM WORD_SPLIT_RNC_ACCUR
GROUP BY WORD_SPLIT_RNC_ACCUR.ID, WORD_SPLIT_RNC_ACCUR.WORD
),
TOP_WORD AS (
SELECT 
    ID,
    WORD AS TOP_WORD
FROM (
    SELECT
        ID,
        WORD,
        WORD_ACCUM,
        ROW_NUMBER() OVER (PARTITION BY ID ORDER BY WORD_ACCUM DESC) AS RN
    FROM WORD_ACCUM
) WHERE RN = 1
),
ROW_ACCUM AS(
SELECT
  WORD_SPLIT_RNC_ACCUR.ID,
  WORD_SPLIT_RNC_ACCUR.LINE_NUM AS WORD_ROW,  
  COUNT(WORD_SPLIT_RNC_ACCUR.WORD) AS ROW_ACCUM
FROM WORD_SPLIT_RNC_ACCUR
GROUP BY WORD_SPLIT_RNC_ACCUR.ID, WORD_SPLIT_RNC_ACCUR.LINE_NUM
),
AVG_ROW AS(
SELECT
  ID,
  ROUND(AVG(ROW_ACCUM), 2) AS AVG_ROW
FROM ROW_ACCUM
GROUP BY ID
)
SELECT 
  WORD_SPLIT_RNC_ACCUR.ID,
  WORD_SPLIT_RNC_ACCUR.WORD,
  WORD_SPLIT_RNC_ACCUR.LINE_NUM AS WORD_ROW,
  WORD_SPLIT_RNC_ACCUR.WORD_POS AS WORD_COLUMN,
  PARAGRAPH_ORDER.FIXED_PARAGRAPH_NUM AS WORD_PARAGRAPH,
  LINE_ORDER.FIXED_LINE_NUM AS LINE_NUM,
  WORD_SPLIT_PNL_ACCUR.WORD_POS AS WORD_LINE_POS,
  WORD_COUNT.WORD_COUNT,
  TOP_WORD.TOP_WORD,
  AVG_ROW.AVG_ROW
FROM WORD_SPLIT_RNC_ACCUR
LEFT JOIN AVG_ROW ON AVG_ROW.ID = WORD_SPLIT_RNC_ACCUR.ID
LEFT JOIN TOP_WORD ON TOP_WORD.ID = WORD_SPLIT_RNC_ACCUR.ID
LEFT JOIN WORD_COUNT ON WORD_COUNT.ID = WORD_SPLIT_RNC_ACCUR.ID
LEFT JOIN WORD_SPLIT_PNL_ACCUR ON WORD_SPLIT_PNL_ACCUR.ID = WORD_SPLIT_RNC_ACCUR.ID AND WORD_SPLIT_PNL_ACCUR.WORD = WORD_SPLIT_RNC_ACCUR.WORD AND WORD_SPLIT_PNL_ACCUR.WORD_OCCURRENCE_INDEX = WORD_SPLIT_RNC_ACCUR.WORD_OCCURRENCE_INDEX
LEFT JOIN PARAGRAPH_ORDER ON PARAGRAPH_ORDER.ID = WORD_SPLIT_PNL_ACCUR.ID AND PARAGRAPH_ORDER.PARAGRAPH_NUM = WORD_SPLIT_PNL_ACCUR.PARAGRAPH_NUM
LEFT JOIN LINE_ORDER ON LINE_ORDER.ID = WORD_SPLIT_PNL_ACCUR.ID AND LINE_ORDER.PARAGRAPH_NUM = WORD_SPLIT_PNL_ACCUR.PARAGRAPH_NUM AND LINE_ORDER.LINE_NUM = WORD_SPLIT_PNL_ACCUR.LINE_NUM
WHERE WORD_SPLIT_RNC_ACCUR.WORD IS NOT NULL
ORDER BY WORD_SPLIT_RNC_ACCUR.ID, WORD_SPLIT_RNC_ACCUR.LINE_NUM, WORD_SPLIT_RNC_ACCUR.WORD_POS