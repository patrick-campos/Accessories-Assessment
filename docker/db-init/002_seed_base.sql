INSERT INTO countries (iso_code, name)
VALUES ('US', 'United States of America')
ON CONFLICT (iso_code) DO NOTHING;

INSERT INTO categories (id, country_iso_code, has_available_buyer, name)
VALUES ('7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Bags')
ON CONFLICT (id) DO NOTHING;

INSERT INTO brands (id, category_id, country_iso_code, has_available_buyer, name)
VALUES
  ('b7a2f4d1-5a5b-4b98-9c7b-2f2b1d3c7f01', '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Balenciaga'),
  ('0f28f4a2-1fbe-4b5a-9a7f-6f2fbf1d9f02', '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Versace'),
  ('9c5c7b2f-4c2f-4b6b-8d0d-3e9b1a7f0f03', '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Dior'),
  ('2d0f9c7b-6a2f-4a8b-9b0d-7f1d2b3c4f04', '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Saint Laurent'),
  ('4f1d2b3c-7f0d-4a9b-8c2f-9b0d1a2f3f05', '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39', 'US', true, 'Chanel')
ON CONFLICT (id) DO NOTHING;

INSERT INTO category_attributes (id, category_id, name, key, display_order, type, is_required, business_model)
VALUES (
    'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10',
    '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39',
    'Size',
    'quote-creation:item-details.attributes.size.title',
    1,
    'OneOf',
    true,
    'Buyback'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO category_attributes (id, category_id, name, key, display_order, type, is_required, business_model)
VALUES (
    'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20',
    '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39',
    'Condition',
    'quote-creation:item-details.attributes.condition.title',
    2,
    'OneOf',
    true,
    'Buyback'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO category_attributes (id, category_id, name, key, display_order, type, is_required, business_model)
VALUES (
    'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30',
    '7b0d9f35-54dd-4d9f-9c56-5a5f7f1d5d39',
    'Extras',
    'quote-creation:item-details.attributes.extras.title',
    3,
    'AnyOf',
    false,
    'Buyback'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO attribute_options (id, attribute_id, name, key, display_order, output_label)
VALUES
  ('a1a1a1a1-1111-4111-8111-111111111111', 'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10', 'XS', 'xs', 1, 'XS'),
  ('a1a1a1a1-1111-4111-8111-222222222222', 'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10', 'S',  's',  2, 'S'),
  ('a1a1a1a1-1111-4111-8111-333333333333', 'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10', 'M',  'm',  3, 'M'),
  ('a1a1a1a1-1111-4111-8111-444444444444', 'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10', 'L',  'l',  4, 'L'),
  ('a1a1a1a1-1111-4111-8111-555555555555', 'c2b4c2b1-6d2a-4d6f-8e55-0c7b6d4f5a10', 'XL', 'xl', 5, 'XL')
ON CONFLICT (id) DO NOTHING;

INSERT INTO attribute_options (id, attribute_id, name, key, display_order, output_label)
VALUES
  ('b2b2b2b2-2222-4222-8222-111111111111', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Unworn', 'unworn', 1, 'Unworn'),
  ('b2b2b2b2-2222-4222-8222-222222222222', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Pristine', 'pristine', 2, 'Pristine'),
  ('b2b2b2b2-2222-4222-8222-333333333333', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Excellent', 'excellent', 3, 'Excellent'),
  ('b2b2b2b2-2222-4222-8222-444444444444', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Good', 'good', 4, 'Good'),
  ('b2b2b2b2-2222-4222-8222-555555555555', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Fair', 'fair', 5, 'Fair'),
  ('b2b2b2b2-2222-4222-8222-666666666666', 'e4b1a7c2-2f27-45a9-93bb-2b2a9f6b1a20', 'Flawed', 'flawed', 6, 'Flawed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO attribute_options (id, attribute_id, name, key, display_order, output_label)
VALUES
  ('c3c3c3c3-3333-4333-8333-111111111111', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Pounch', 'pounch', 1, 'Pounch'),
  ('c3c3c3c3-3333-4333-8333-222222222222', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Dustbag', 'dustbag', 2, 'Dustbag'),
  ('c3c3c3c3-3333-4333-8333-333333333333', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Shoulder Strap', 'shoulder-strap', 3, 'Shoulder Strap'),
  ('c3c3c3c3-3333-4333-8333-444444444444', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Authenticity Card', 'authenticity-card', 4, 'Authenticity Card'),
  ('c3c3c3c3-3333-4333-8333-555555555555', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Bag Charm', 'bag-charm', 5, 'Bag Charm'),
  ('c3c3c3c3-3333-4333-8333-666666666666', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Name Tag', 'name-tag', 6, 'Name Tag'),
  ('c3c3c3c3-3333-4333-8333-777777777777', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Mirror', 'mirror', 7, 'Mirror'),
  ('c3c3c3c3-3333-4333-8333-888888888888', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Padlock & Key', 'padlock-key', 8, 'Padlock & Key'),
  ('c3c3c3c3-3333-4333-8333-999999999999', 'f6c2d9b1-3d24-4c7a-8b6f-9f3c4a2b1c30', 'Box', 'box', 9, 'Box')
ON CONFLICT (id) DO NOTHING;
