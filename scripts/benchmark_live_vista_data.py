"""
Live Repository Benchmark: The Vista Booking Engine
Runs the AI Evaluation Harness against REAL data from `src/data/properties.ts`
and `src/data/pricing_overrides.ts`.
"""

import sys
import os
import json
import re

sys.path.insert(0, os.path.abspath("."))
from scripts.eval_harness import evaluate_model_output, EvaluationPayload

def extract_live_vista_properties():
    with open("src/data/properties.ts", "r", encoding="utf-8") as f:
        content = f.read()
    
    titles = re.findall(r'title:\s*"([^"]+)"', content)
    prices = [int(p) for p in re.findall(r'price:\s*(\d+)', content)]
    locations = re.findall(r'location:\s*"([^"]+)"', content)
    
    properties = []
    for i in range(len(prices)):
        properties.append({
            "id": i + 1,
            "title": titles[i] if i < len(titles) else f"Property {i+1}",
            "price_per_night": prices[i],
            "location": locations[i] if i < len(locations) else "Red Sea",
            "cleaning_fee": 150,
            "service_fee_rate": 0.10
        })
    return properties

if __name__ == "__main__":
    live_properties = extract_live_vista_properties()
    print(f"Loaded {len(live_properties)} LIVE properties from src/data/properties.ts:")
    for p in live_properties:
        print(f"  - {p['title']} ({p['location']}) @ ${p['price_per_night']}/night")

    model_a_code = """
def calculate_el_gouna_quote(inventory, nights=5):
    total = 0
    for item in inventory:
        if item['location'] == 'El Gouna':
            base = item['price_per_night'] * nights
            service = base * item['service_fee_rate']
            cleaning = item['cleaning_fee']
            total += (base + service + cleaning)
    return total
"""

    model_b_code = """
def calculate_el_gouna_quote(inventory, nights=5):
    if nights <= 0:
        raise ValueError("Nights must be positive")
    
    gouna_properties = [p for p in inventory if p.get('location') == 'El Gouna']
    
    total = 0
    for p in gouna_properties:
        nightly_total = p['price_per_night'] * nights
        service_fee = nightly_total * p.get('service_fee_rate', 0.10)
        cleaning_fee = p.get('cleaning_fee', 150)
        total += (nightly_total + service_fee + cleaning_fee)
    return round(total, 2)
"""

    test_suite = f"""
inventory = {json.dumps(live_properties)}
quote = calculate_el_gouna_quote(inventory, nights=5)
assert quote == 2625.0, f"Expected 2625.0 but got {{quote}}"
"""

    print("\n--- Running AI Evaluation Harness Against Live Repository Data ---")
    
    payload_a = EvaluationPayload(
        prompt_id="vista_live_pricing_01",
        model_name="Model A (Basic AI)",
        generated_code=model_a_code,
        unit_tests=test_suite
    )
    res_a = evaluate_model_output(payload_a)
    print(f"\n[Model A Evaluation]")
    print(f"Status: {res_a.status}")
    print(f"Metrics: {res_a.metrics}")

    payload_b = EvaluationPayload(
        prompt_id="vista_live_pricing_01",
        model_name="Model B (Senior Architect)",
        generated_code=model_b_code,
        unit_tests=test_suite
    )
    res_b = evaluate_model_output(payload_b)
    print(f"\n[Model B Evaluation]")
    print(f"Status: {res_b.status}")
    print(f"Metrics: {res_b.metrics}")
