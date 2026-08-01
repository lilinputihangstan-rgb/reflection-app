-- ============================================================
-- REFLECTION — Skema Database Supabase
-- Jalankan seluruh file ini di: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Perlu untuk membuat UUID otomatis
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. PROFILES — identitas publik tiap pengguna
-- ------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  status text default '',
  bio text default '',
  avatar_emoji text default '🌿',
  avatar_color text default '#B5654A',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Profil bisa dibaca siapa saja"
  on profiles for select using (true);

create policy "Pengguna hanya bisa membuat profilnya sendiri"
  on profiles for insert with check (auth.uid() = id);

create policy "Pengguna hanya bisa mengubah profilnya sendiri"
  on profiles for update using (auth.uid() = id);

-- ------------------------------------------------------------
-- 2. JOURNAL_ENTRIES — jurnal privat, hanya pemilik yang bisa akses
-- ------------------------------------------------------------
create table journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ts timestamptz default now(),
  mood text not null,
  text text not null,
  prompt_id text,
  is_public boolean default false
);

alter table journal_entries enable row level security;

create policy "Jurnal hanya bisa diakses pemiliknya"
  on journal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3. POSTS — refleksi yang dipublikasikan ke Beranda
-- ------------------------------------------------------------
create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  ts timestamptz default now(),
  mood text not null,
  text text not null
);

alter table posts enable row level security;

create policy "Post publik bisa dibaca siapa saja"
  on posts for select using (true);

create policy "Hanya pemilik yang bisa membuat post miliknya"
  on posts for insert with check (auth.uid() = user_id);

create policy "Hanya pemilik yang bisa menghapus post miliknya"
  on posts for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. POST_LIKES
-- ------------------------------------------------------------
create table post_likes (
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

alter table post_likes enable row level security;

create policy "Like bisa dibaca siapa saja"
  on post_likes for select using (true);

create policy "Pengguna hanya bisa like/unlike atas namanya sendiri"
  on post_likes for insert with check (auth.uid() = user_id);

create policy "Pengguna hanya bisa unlike milik sendiri"
  on post_likes for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. POST_COMMENTS
-- ------------------------------------------------------------
create table post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  text text not null,
  ts timestamptz default now()
);

alter table post_comments enable row level security;

create policy "Komentar bisa dibaca siapa saja"
  on post_comments for select using (true);

create policy "Pengguna hanya bisa berkomentar atas namanya sendiri"
  on post_comments for insert with check (auth.uid() = user_id);

create policy "Pengguna hanya bisa menghapus komentarnya sendiri"
  on post_comments for delete using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. FOLLOWS
-- ------------------------------------------------------------
create table follows (
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Daftar follow bisa dibaca siapa saja"
  on follows for select using (true);

create policy "Pengguna hanya bisa follow atas namanya sendiri"
  on follows for insert with check (auth.uid() = follower_id);

create policy "Pengguna hanya bisa unfollow atas namanya sendiri"
  on follows for delete using (auth.uid() = follower_id);

-- ------------------------------------------------------------
-- Index tambahan biar query cepat
-- ------------------------------------------------------------
create index idx_journal_user on journal_entries(user_id, ts desc);
create index idx_posts_ts on posts(ts desc);
create index idx_posts_user on posts(user_id);
create index idx_comments_post on post_comments(post_id);
create index idx_follows_following on follows(following_id);
