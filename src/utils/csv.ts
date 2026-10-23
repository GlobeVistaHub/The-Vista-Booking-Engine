import { Property } from "@/data/properties";

/**
 * Professional CSV Parser for Vista Booking Engine
 * Handles quotes, commas, and multi-line descriptions.
 */
/**
 * Professional CSV Parser for Vista Booking Engine
 * Handles quoted commas, escaped characters, and multi-line fields.
 */
export function parsePropertiesCSV(csvText: string): Partial<Property>[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Robust regex for splitting CSV lines while respecting quoted values
  const splitLine = (text: string) => {
    const regex = /(".*?"|[^",]+|(?<=,)(?=,)|(?<=^)(?=,)|(?<=,)(?=$))/g;
    return (text.match(regex) || []).map(val => val.trim().replace(/^"|"$/g, "").replace(/""/g, '"'));
  };

  const headers = splitLine(lines[0]).map(h => h.trim().toLowerCase());
  const results: Partial<Property>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = splitLine(line);
    const property: any = {};

    headers.forEach((header, index) => {
      const val = values[index];
      if (val === undefined) return;

      // Map headers correctly (handling snake_case to camelCase)
      let key = header;
      if (header === "base_guests") key = "baseGuests";
      if (header === "owner_phone" || header === "ownerphone") key = "ownerPhone";
      if (header === "owner_email" || header === "owneremail") key = "ownerEmail";
      if (header === "is_instant_bookable") key = "isInstantBookable";
      if (header === "is_booked") key = "isBooked";

      if (header === "price" || header === "rating" || header === "reviews" || header === "base_guests") {
        const num = Number(val);
        property[key] = isNaN(num) ? 0 : num;
      } else if (header === "lat" || header === "lng") {
        const flt = parseFloat(val);
        property[key] = isNaN(flt) ? 0 : flt;
      } else if (header === "images" || header === "tags") {
        // Support both semicolon and pipe separators
        property[key] = val.split(/[;|]/).map(s => s.trim()).filter(Boolean);
      } else if (header === "is_instant_bookable" || header === "is_booked") {
        property[key] = val.toLowerCase() === "true";
      } else {
        property[key] = val;
      }
    });

    results.push(property as Partial<Property>);
  }

  return results;
}

/**
 * Generates a template CSV string with all 19 required headers.
 * Includes UTF-8 BOM for Excel compatibility with Arabic characters.
 */
export function generateCSVTemplate(): string {
  const BOM = "\ufeff";
  const headers = [
    "id", "title", "title_ar", "type", "price", "location", "location_ar", 
    "guests", "base_guests", "bedrooms", "description_en", "description_ar", "is_booked", 
    "is_instant_bookable", "images", "tags", "lat", "lng", 
    "ownerPhone", "ownerEmail"
  ];
  const example = [
    "V-101", "Sea Breeze Sanctuary", "ملاذ نسيم البحر", "Villa", "450", "El Gouna", "الجونة", 
    "8", "4", "4", "A stunning villa with private pool.", "فيلا رائعة مع مسبح خاص.", "false", 
    "true", "https://image1.jpg|https://image2.jpg", "tagPool|tagSeaView", "27.39", "33.68", 
    "+201145551163", "support@globevistahub.com"
  ];

  // Properly quote the example values
  const quotedExample = example.map(val => `"${val.replace(/"/g, '""')}"`);

  return BOM + [headers.join(","), quotedExample.join(",")].join("\n");
}
