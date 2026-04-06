-- ============================================================
-- Kingdom Arts Academy — Supabase Database Schema
-- Run this in your Supabase Dashboard → SQL Editor
-- Project: xmsvufqsoqipzspjysvx
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enums ──────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin', 'guest');
CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended', 'on_leave');
CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'All Levels');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');

-- ── Profiles ───────────────────────────────────────────────
-- Extends Supabase Auth users with app-specific data
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  role          user_role NOT NULL DEFAULT 'student',
  avatar_url    TEXT,
  bio           TEXT,
  instrument    TEXT,
  city          TEXT,
  status        user_status NOT NULL DEFAULT 'pending',
  level         INTEGER NOT NULL DEFAULT 1,
  xp            INTEGER NOT NULL DEFAULT 0,
  xp_to_next    INTEGER NOT NULL DEFAULT 100,
  crowns        INTEGER NOT NULL DEFAULT 0,
  streak        INTEGER NOT NULL DEFAULT 0,
  invite_code   TEXT UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate invite code on insert
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.invite_code := 'KAA-' || UPPER(SUBSTRING(NEW.full_name FROM 1 FOR 6)) || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 3));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_invite_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.invite_code IS NULL)
  EXECUTE FUNCTION generate_invite_code();

-- Auto-create profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, instrument, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    COALESCE(NEW.raw_user_meta_data->>'instrument', ''),
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── Courses ────────────────────────────────────────────────
CREATE TABLE public.courses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  instrument      TEXT NOT NULL,
  level           course_level NOT NULL DEFAULT 'Beginner',
  instructor_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thumbnail_url   TEXT,
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_weeks  INTEGER NOT NULL DEFAULT 4,
  lesson_count    INTEGER NOT NULL DEFAULT 0,
  rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Lessons ────────────────────────────────────────────────
CREATE TABLE public.lessons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id         UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  description       TEXT,
  video_url         TEXT,
  duration_minutes  INTEGER NOT NULL DEFAULT 0,
  order_index       INTEGER NOT NULL DEFAULT 0,
  is_free_preview   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Enrollments ────────────────────────────────────────────
CREATE TABLE public.enrollments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status        enrollment_status NOT NULL DEFAULT 'active',
  progress      INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  enrolled_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- ── Messages ───────────────────────────────────────────────
CREATE TABLE public.messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX messages_sender_idx ON public.messages(sender_id);
CREATE INDEX messages_receiver_idx ON public.messages(receiver_id);

-- ── Community Posts ────────────────────────────────────────
CREATE TABLE public.community_posts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'General',
  likes       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security (RLS) ───────────────────────────────
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only their own
CREATE POLICY "profiles_select_all"   ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"   ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"   ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: anyone can read published; instructors manage own
CREATE POLICY "courses_select_published" ON public.courses FOR SELECT USING (is_published = true OR instructor_id = auth.uid());
CREATE POLICY "courses_insert_instructor" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('instructor','admin'))
);
CREATE POLICY "courses_update_own" ON public.courses FOR UPDATE USING (instructor_id = auth.uid() OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Lessons: same visibility as courses
CREATE POLICY "lessons_select" ON public.lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND (c.is_published = true OR c.instructor_id = auth.uid()))
);
CREATE POLICY "lessons_insert_instructor" ON public.lessons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.instructor_id = auth.uid())
);

-- Enrollments: users see their own
CREATE POLICY "enrollments_select_own" ON public.enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "enrollments_insert_own" ON public.enrollments FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "enrollments_update_own" ON public.enrollments FOR UPDATE USING (user_id = auth.uid());

-- Messages: see own sent/received
CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "messages_update_own" ON public.messages FOR UPDATE USING (receiver_id = auth.uid());

-- Community posts: all authenticated users can read; authors manage their own
CREATE POLICY "posts_select_all"    ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_auth"   ON public.community_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "posts_update_own"    ON public.community_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "posts_delete_own"    ON public.community_posts FOR DELETE USING (author_id = auth.uid());

-- ── Updated-at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at        BEFORE UPDATE ON public.profiles        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER courses_updated_at         BEFORE UPDATE ON public.courses         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER community_posts_updated_at BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
