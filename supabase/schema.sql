create extension if not exists pgcrypto;

create table if not exists drugs (
  id uuid primary key default gen_random_uuid(),
  generic_name text not null unique,
  generic_name_normalized text not null unique,
  drug_class text not null,
  renal_dosing jsonb not null default '{}'::jsonb
);

create table if not exists drug_interactions (
  id uuid primary key default gen_random_uuid(),
  drug_a text not null,
  drug_b text not null,
  severity text not null check (severity in ('CONTRAINDICATED','SEVERE','MODERATE','MINOR')),
  mechanism text not null,
  clinical_effect text not null,
  management text not null
);

create table if not exists allergy_cross_reactivity (
  id uuid primary key default gen_random_uuid(),
  allergy_to text not null,
  cross_reacts_with text not null,
  cross_reactivity_pct text not null,
  clinical_guidance text not null
);
