-- ENABLE UUID
create extension if not exists "uuid-ossp";

-- SPACES
create table public.spaces (
  id uuid primary key default uuid_generate_v4(),
  public_id text unique,
  creator_ip_hash text,
  settings jsonb default '{"public_upload": false, "download_allowed": true, "password_protected": false}'::jsonb,
  total_size_bytes bigint default 0,
  file_count int default 0,
  expires_at timestamptz not null default (now() + interval '3 days'),
  created_at timestamptz default now()
);
create index idx_spaces_ip_hash on public.spaces(creator_ip_hash);
create index idx_spaces_public_id on public.spaces(public_id);

-- TOKENS
create type token_type as enum ('ADMIN', 'UPLOADER', 'VIEWER');
create table public.tokens (
  id uuid primary key default uuid_generate_v4(),
  space_id uuid references public.spaces(id) on delete cascade not null,
  token_hash text not null,
  type token_type not null,
  created_at timestamptz default now()
);
create index idx_tokens_hash on public.tokens(token_hash);

-- FILES
create table public.files (
  id uuid primary key default uuid_generate_v4(),
  space_id uuid references public.spaces(id) on delete cascade not null,
  filename text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint not null,
  download_count int default 0,
  created_at timestamptz default now()
);