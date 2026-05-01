create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists product_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type_id uuid not null references product_types(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  type_id uuid references product_types(id) on delete set null,
  product_type_id uuid references product_types(id) on delete set null,
  section_id uuid references sections(id) on delete set null,
  name text not null,
  price numeric not null default 0,
  preview_description text,
  description text,
  weight text,
  image_url text,
  images text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text not null,
  address text not null,
  delivery_address text,
  notes text,
  total_amount numeric not null default 0,
  status text not null default 'new',
  token text,
  created_at timestamptz not null default now()
);

alter table products add column if not exists type_id uuid references product_types(id) on delete set null;
alter table products add column if not exists section_id uuid references sections(id) on delete set null;
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists address text;
alter table orders add column if not exists token text;
alter table orders alter column delivery_address drop not null;

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null default 0,
  total_price numeric not null default 0,
  created_at timestamptz not null default now()
);

insert into categories (name, slug)
values
  ('Wedding', 'wedding'),
  ('Birthday', 'birthday'),
  ('New Baby', 'new-baby'),
  ('Other events', 'other-events')
on conflict (slug) do nothing;

insert into product_types (name, slug)
values
  ('Chocolate Boxes', 'chocolate-boxes'),
  ('Hospitality / Gifts', 'hospitality-gifts')
on conflict (slug) do nothing;

insert into sections (name, type_id)
select 'Luxury', id from product_types where slug = 'chocolate-boxes'
union all
select 'Classic', id from product_types where slug = 'hospitality-gifts'
on conflict do nothing;

alter table categories enable row level security;
alter table product_types enable row level security;
alter table sections enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public categories are readable"
on categories for select
to anon
using (true);

create policy "Public product types are readable"
on product_types for select
to anon
using (true);

create policy "Public sections are readable"
on sections for select
to anon
using (true);

create policy "Active products are readable"
on products for select
to anon
using (is_active = true);

create policy "Customers can create orders"
on orders for insert
to anon
with check (true);

create policy "Customers can create order items"
on order_items for insert
to anon
with check (true);

create policy "Orders are readable for storefront"
on orders for select
to anon
using (true);

create policy "Order items are readable for storefront"
on order_items for select
to anon
using (true);
