-- Migration: Add 3 Specialty Detailing Services (PPF, Leather, Engine Bay)

INSERT INTO public.services (id, name, base_price, duration_minutes) VALUES
    ('7d2e4a81-9b51-4e1a-8f12-9c3f6e8a0112', 'Paint Protection Film (PPF)', 180000, 960),
    ('5c3d1e92-8a40-4d2b-9e23-8b2e5f7a0223', 'Leather Hide Rejuvenation', 45000, 240),
    ('3b1c9d83-7f39-4c3a-8d34-7a1e4d6a0334', 'Engine Bay Precision Detail', 25000, 120)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    base_price = EXCLUDED.base_price,
    duration_minutes = EXCLUDED.duration_minutes;

INSERT INTO public.site_content (key, value) VALUES
    ('service_title_ppf', 'Paint Protection Film (PPF)'),
    ('service_price_ppf', 'FROM $1,800'),
    ('service_desc_ppf', 'Full front or whole vehicle ultra-durable self-healing TPU film providing impenetrable defense against stone chips, scratches, and UV damage.'),
    ('service_features_ppf', 'Self-Healing Polymer
Rock Chip Protection
Optical Clarity Finish
10-Year Warranty'),
    ('service_title_leather', 'Leather Hide Rejuvenation'),
    ('service_price_leather', 'FROM $450'),
    ('service_desc_leather', 'Artisanal pH-balanced deep pore extraction, hydration oil replenishment, and matte barrier finish to restore factory suppleness without artificial shine.'),
    ('service_features_leather', 'Pore-Deep Extraction
Natural Oil Replenishment
Zero-Grease Factory Matte
UV Anti-Cracking Barrier'),
    ('service_title_engine', 'Engine Bay Precision Detail'),
    ('service_price_engine', 'FROM $250'),
    ('service_desc_engine', 'Surgical dry-ice and vapor degreasing of all engine bay plastics, metals, and firewall, sealed with an anti-static heat-resistant dressed finish.'),
    ('service_features_engine', 'Sensitive Component Masking
Precision Vapor Degreasing
Heat-Resistant Dressing
Anti-Static Dust Repellent')
ON CONFLICT (key) DO NOTHING;
