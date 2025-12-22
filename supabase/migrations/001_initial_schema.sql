-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  scraped_data JSONB NOT NULL,
  notes TEXT DEFAULT '',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  enthusiasm_score INTEGER CHECK (enthusiasm_score >= 1 AND enthusiasm_score <= 10),
  stage TEXT NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'scheduled', 'visited', 'archived')),
  scheduled_visit_date TIMESTAMPTZ,
  visited_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_property UNIQUE(user_id, url)
);

-- Create indexes for performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_stage ON properties(stage);
CREATE INDEX idx_properties_scheduled_date ON properties(scheduled_visit_date);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Create property_photos table for Phase 2
CREATE TABLE property_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_property_id ON property_photos(property_id);

-- Create ai_analysis table for Phase 3
CREATE TABLE ai_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analysis_property_id ON ai_analysis(property_id);
