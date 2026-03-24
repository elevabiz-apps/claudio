-- ── Carousel Designs ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS carousel_designs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Untitled Carousel',
  slides      JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_carousel_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER carousel_designs_updated_at
  BEFORE UPDATE ON carousel_designs
  FOR EACH ROW EXECUTE FUNCTION update_carousel_updated_at();

-- Row Level Security
ALTER TABLE carousel_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own carousel designs"
  ON carousel_designs
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
