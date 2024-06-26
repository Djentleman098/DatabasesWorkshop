WITH CLOB_DATA AS (
  SELECT TEXT_ID AS ID, 
         UTL_RAW.CAST_TO_VARCHAR2(DBMS_LOB.SUBSTR(TEXT_DATA, DBMS_LOB.GETLENGTH(TEXT_DATA), 1)) AS CLOB_TEXT
  FROM TEXTS
),
LINE_SPLIT AS (
  SELECT ID,
         CLOB_TEXT,
         REGEXP_SUBSTR(CLOB_TEXT, '[^' || CHR(10) || ']+', 1, LEVEL) AS LINE,
         LEVEL AS LINE_NUM
  FROM CLOB_DATA
  CONNECT BY PRIOR ID = ID
         AND PRIOR dbms_random.value IS NOT NULL
         AND LEVEL <= LENGTH(CLOB_TEXT) - LENGTH(REPLACE(CLOB_TEXT, CHR(10), '')) + 1
),
WORD_SPLIT AS (
  SELECT ID, 
         LINE_NUM, 
         REGEXP_SUBSTR(LINE, '[^[:space:]]+', 1, LEVEL) AS WORD, 
         LEVEL AS WORD_POS, 
         LINE
  FROM LINE_SPLIT
  CONNECT BY PRIOR ID = ID 
         AND PRIOR LINE_NUM = LINE_NUM 
         AND PRIOR dbms_random.value IS NOT NULL 
         AND LEVEL <= LENGTH(LINE) - LENGTH(REPLACE(LINE, ' ', '')) + 1
),
HIGHLIGHTED_WORDS AS (
  SELECT ID,
         LINE_NUM,
         CASE 
           WHEN LINE_NUM = :varX AND WORD_POS = :varY THEN '<<' || WORD || '>>'
           ELSE WORD
         END AS HIGHLIGHTED_WORD,
         WORD_POS
  FROM WORD_SPLIT
),
RECONSTRUCTED_LINES AS (
  SELECT ID,
         LINE_NUM,
         LISTAGG(HIGHLIGHTED_WORD, ' ') WITHIN GROUP (ORDER BY WORD_POS) AS RECONSTRUCTED_LINE
  FROM HIGHLIGHTED_WORDS
  GROUP BY ID, LINE_NUM
),
HIGHLIGHTED_TEXT AS (
  SELECT ID,
         LISTAGG(RECONSTRUCTED_LINE || CHR(10), NULL) WITHIN GROUP (ORDER BY LINE_NUM) AS FULL_TEXT
  FROM RECONSTRUCTED_LINES
  GROUP BY ID
)
SELECT ID AS TEXT_ID, FULL_TEXT AS TEXT_DATA
FROM HIGHLIGHTED_TEXT
WHERE ID = :textId