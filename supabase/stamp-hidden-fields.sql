-- Stamp hidden: true on subsections not rendered in the main UI
-- Run this on the LAST completed project to backfill hidden flags

-- Get the most recent completed project
WITH latest AS (
  SELECT id FROM projects
  WHERE status = 'completed' AND generation_result IS NOT NULL
  ORDER BY updated_at DESC
  LIMIT 1
)

UPDATE projects p
SET generation_result = (
  SELECT jsonb_set(
    jsonb_set(
      -- research.benefitExpansion.hidden = true
      CASE
        WHEN p.generation_result->'research'->'benefitExpansion' IS NOT NULL
        THEN jsonb_set(p.generation_result, '{research,benefitExpansion,hidden}', 'true')
        ELSE p.generation_result
      END,
      -- salesPlaybook.system1Triggers — stamp hidden on each item
      '{salesPlaybook,system1Triggers}',
      COALESCE(
        (SELECT jsonb_agg(item || '{"hidden": true}')
         FROM jsonb_array_elements(p.generation_result->'salesPlaybook'->'system1Triggers') AS item),
        '[]'::jsonb
      )
    ),
    -- salesPlaybook.system2Triggers — stamp hidden on each item
    '{salesPlaybook,system2Triggers}',
    COALESCE(
      (SELECT jsonb_agg(item || '{"hidden": true}')
       FROM jsonb_array_elements(p.generation_result->'salesPlaybook'->'system2Triggers') AS item),
      '[]'::jsonb
    )
  )
)
FROM latest
WHERE p.id = latest.id;

-- Stamp hidden on NLP stackStrategy items
WITH latest AS (
  SELECT id FROM projects
  WHERE status = 'completed' AND generation_result IS NOT NULL
  ORDER BY updated_at DESC
  LIMIT 1
)
UPDATE projects p
SET generation_result = jsonb_set(
  p.generation_result,
  '{salesPlaybook,nlp,stackStrategy}',
  COALESCE(
    (SELECT jsonb_agg(item || '{"hidden": true}')
     FROM jsonb_array_elements(p.generation_result->'salesPlaybook'->'nlp'->'stackStrategy') AS item),
    '[]'::jsonb
  )
)
FROM latest
WHERE p.id = latest.id;

-- Stamp hidden on creativeTree scripts (full/mechanism steps)
WITH latest AS (
  SELECT id FROM projects
  WHERE status = 'completed' AND generation_result IS NOT NULL
  ORDER BY updated_at DESC
  LIMIT 1
)
UPDATE projects p
SET generation_result = jsonb_set(
  p.generation_result,
  '{creativeTree,scripts}',
  (
    SELECT jsonb_object_agg(
      key,
      (SELECT jsonb_agg(
        jsonb_set(
          script,
          '{steps}',
          (SELECT jsonb_agg(
            CASE
              WHEN step->>'type' IN ('full', 'mechanism')
              THEN step || '{"hidden": true}'
              ELSE step
            END
          ) FROM jsonb_array_elements(script->'steps') AS step)
        )
      ) FROM jsonb_array_elements(value) AS script)
    )
    FROM jsonb_each(p.generation_result->'creativeTree'->'scripts') AS kv(key, value)
  )
)
FROM latest
WHERE p.id = latest.id
AND p.generation_result->'creativeTree'->'scripts' IS NOT NULL;

-- Stamp hidden on topCreatives.creatives and their hooks
WITH latest AS (
  SELECT id FROM projects
  WHERE status = 'completed' AND generation_result IS NOT NULL
  ORDER BY updated_at DESC
  LIMIT 1
)
UPDATE projects p
SET generation_result = jsonb_set(
  p.generation_result,
  '{topCreatives,creatives}',
  (
    SELECT jsonb_agg(
      jsonb_set(
        creative || '{"hidden": true}',
        '{hooks}',
        (SELECT jsonb_agg(hook || '{"hidden": true}')
         FROM jsonb_array_elements(creative->'hooks') AS hook)
      )
    )
    FROM jsonb_array_elements(p.generation_result->'topCreatives'->'creatives') AS creative
  )
)
FROM latest
WHERE p.id = latest.id
AND p.generation_result->'topCreatives'->'creatives' IS NOT NULL;
