-- Migration: Add Graphene Matrix 10H Coating Premier Detailing Service

INSERT INTO public.services (id, name, base_price, duration_minutes) VALUES
    ('9e4f1a2b-3c5d-4e6f-8a0b-1c2d3e4f5a6b', 'Graphene Matrix 10H Coating', 150000, 480)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    base_price = EXCLUDED.base_price,
    duration_minutes = EXCLUDED.duration_minutes;

INSERT INTO public.site_content (key, value) VALUES
    ('service_title_graphene', 'Graphene Matrix 10H'),
    ('service_price_graphene', 'FROM $1,500'),
    ('service_desc_graphene', 'Next-generation reduced graphene oxide matrix offering extreme 10H hardness, anti-static dust repelling, and permanent mirror-sheen.'),
    ('service_features_graphene', '10H Diamond-Grade Hardness
Anti-Static Dust Dissipation
Zero Water-Spot Technology
7-Year Certified Warranty')
ON CONFLICT (key) DO NOTHING;
