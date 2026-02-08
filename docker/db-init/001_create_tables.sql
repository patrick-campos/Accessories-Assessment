CREATE TABLE IF NOT EXISTS countries (
    iso_code varchar(2) PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id uuid PRIMARY KEY,
    country_iso_code varchar(2) NOT NULL,
    has_available_buyer boolean NOT NULL,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS brands (
    id uuid PRIMARY KEY,
    category_id uuid NOT NULL,
    country_iso_code varchar(2) NOT NULL,
    has_available_buyer boolean NOT NULL,
    name text NOT NULL
);

CREATE TABLE IF NOT EXISTS category_attributes (
    id uuid PRIMARY KEY,
    category_id uuid NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    display_order int NOT NULL,
    type text NOT NULL,
    is_required boolean NOT NULL,
    business_model text NOT NULL
);

CREATE TABLE IF NOT EXISTS attribute_options (
    id uuid PRIMARY KEY,
    attribute_id uuid NOT NULL,
    name text NOT NULL,
    key text NOT NULL,
    display_order int NOT NULL,
    output_label text NOT NULL
);

CREATE TABLE IF NOT EXISTS file_uploads (
    id uuid PRIMARY KEY,
    provider text NOT NULL,
    external_id text NOT NULL,
    location text NULL,
    photo_type text NOT NULL,
    photo_subtype text NOT NULL,
    description text NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
    id uuid PRIMARY KEY,
    country_of_origin_iso_code varchar(2) NOT NULL,
    created_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY,
    quote_id uuid NOT NULL,
    external_seller_tier text NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL
);

CREATE TABLE IF NOT EXISTS items (
    id uuid PRIMARY KEY,
    quote_id uuid NOT NULL,
    category_id uuid NOT NULL,
    brand_id uuid NOT NULL,
    model text NOT NULL,
    description text NULL
);

CREATE TABLE IF NOT EXISTS item_attributes (
    id uuid PRIMARY KEY,
    item_id uuid NOT NULL,
    attribute_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS item_attribute_values (
    id uuid PRIMARY KEY,
    item_attribute_id uuid NOT NULL,
    value_id uuid NOT NULL,
    label text NOT NULL
);

CREATE TABLE IF NOT EXISTS item_files (
    id uuid PRIMARY KEY,
    item_id uuid NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    external_id text NOT NULL,
    location text NULL,
    photo_type text NOT NULL,
    photo_subtype text NOT NULL,
    description text NULL
);
