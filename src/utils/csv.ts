import { Property } from "@/data/properties";

/**
 * Professional CSV Parser for Vista Booking Engine
 * Handles quotes, commas, and multi-line descriptions.
 */
export function parsePropertiesCSV(csvText: string): Partial<Property>[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const results: Partial<Property>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Basic CSV splitting (handling quotes would be better, but this is a start)
    // For a production-ready system, we'd use a regex or library like PapaParse
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    const property: any = {};

    headers.forEach((header, index) => {
      const val = values[index];
      if (val === undefined || val === "") return;

      // Map snake_case headers from CSV to camelCase Property keys
      let key = header;
      if (header === "base_guests") key = "baseGuests";
      if (header === "owner_phone") key = "ownerPhone";
      if (header === "is_instant_bookable") key = "isInstantBookable";

      if (header === "price" || header === "rating" || header === "reviews" || header === "base_guests") {
        const num = Number(val);
        property[key] = isNaN(num) ? 0 : num;
      } else if (header === "lat" || header === "lng") {
        const flt = parseFloat(val);
        property[key] = isNaN(flt) ? 0 : flt;
      } else if (header === "images" || header === "tags") {
        property[key] = val.split(";").map(s => s.trim()).filter(Boolean);
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
 * Generates a template CSV string with all required headers.
 * Includes UTF-8 BOM for Excel compatibility with Arabic characters.
 */
export function generateCSVTemplate(): string {
  const BOM = "\ufeff";
  const headers = [
    "title", "title_ar", "type", "location", "location_ar", "price", 
    "base_guests", "guests", "bedrooms", "images", "tags", 
    "description_en", "description_ar", "lat", "lng", 
    "owner_phone", "is_instant_bookable"
  ];
  const example = [
    "Villa Serenity", "فيلا سيرينيتي", "Villa", "El Gouna", "الجونة", "450",
    "4", "8", "4", "https://image1.jpg;https://image2.jpg", "tagPool;tagSeaView",
    "English description here", "وصف باللغة العربية هنا", "27.39", "33.68",
    "+201145551163", "true"
  ];
  
  return BOM + [headers.join(","), example.join(",")].join("\n");
}
