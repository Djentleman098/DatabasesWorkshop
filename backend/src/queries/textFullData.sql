SELECT
TEXTS.TEXT_ID,
TEXT_TYPE.TYPE,
METADATA_OPTIONS.METADATA_OPTION_NAME,
METADATA_VALUES.METADATA_VALUE
FROM TEXTS
LEFT JOIN TEXT_TYPE ON TEXT_TYPE.ID = TEXTS.TYPE_ID
LEFT JOIN METADATA_VALUES ON METADATA_VALUES.TEXT_ID = TEXTS.TEXT_ID
LEFT JOIN METADATA_OPTIONS ON METADATA_OPTIONS.METADATA_OPTION_ID = METADATA_VALUES.METADATA_OPTION_ID
WHERE TEXTS.TEXT_ID = :variable