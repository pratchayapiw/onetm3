-- O-NET M3 Tutoring — Supabase schema
-- Project: verify Evaluation (rwvgunkkcrddijkxguej)
-- Tables prefixed onet_ to avoid conflicts

CREATE TABLE IF NOT EXISTS onet_schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onet_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT REFERENCES onet_schools(id),
  name TEXT NOT NULL,
  class TEXT,
  student_no TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onet_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id TEXT REFERENCES onet_schools(id),
  year INT NOT NULL,
  class TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  teacher TEXT
);

CREATE TABLE IF NOT EXISTS onet_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES onet_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES onet_students(id) ON DELETE CASCADE,
  item_no INT NOT NULL,
  choice INT,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onet_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES onet_sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES onet_students(id) ON DELETE CASCADE,
  total INT DEFAULT 32,
  correct INT DEFAULT 0,
  pct NUMERIC(5,2),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, student_id)
);
