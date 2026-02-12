/**
 * Minimal YAML serializer for simple key-value structures.
 * Handles the schema.yaml format: scalars, arrays of objects, and multiline strings.
 */
export function stringify(obj: Record<string, unknown>, indent = 0): string {
  const pad = "  ".repeat(indent);
  let out = "";

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      out += `${pad}${key}:\n`;
    } else if (typeof value === "string") {
      if (value.includes("\n")) {
        out += `${pad}${key}: |\n`;
        for (const line of value.split("\n")) {
          out += `${pad}  ${line}\n`;
        }
      } else {
        out += `${pad}${key}: ${value}\n`;
      }
    } else if (typeof value === "number" || typeof value === "boolean") {
      out += `${pad}${key}: ${value}\n`;
    } else if (Array.isArray(value)) {
      out += `${pad}${key}:\n`;
      for (const item of value) {
        if (typeof item === "string") {
          out += `${pad}  - ${item}\n`;
        } else if (typeof item === "object" && item !== null) {
          const entries = Object.entries(item as Record<string, unknown>);
          if (entries.length > 0) {
            const [firstKey, firstVal] = entries[0];
            out += `${pad}  - ${firstKey}: ${formatValue(firstVal)}\n`;
            for (const [k, v] of entries.slice(1)) {
              if (typeof v === "string" && v.includes("\n")) {
                out += `${pad}    ${k}: |\n`;
                for (const line of v.split("\n")) {
                  out += `${pad}      ${line}\n`;
                }
              } else if (Array.isArray(v)) {
                out += `${pad}    ${k}:\n`;
                for (const arrItem of v) {
                  out += `${pad}      - ${arrItem}\n`;
                }
              } else if (typeof v === "object" && v !== null) {
                out += `${pad}    ${k}:\n`;
                out += stringify(v as Record<string, unknown>, indent + 3);
              } else {
                out += `${pad}    ${k}: ${formatValue(v)}\n`;
              }
            }
          }
        }
      }
    } else if (typeof value === "object") {
      out += `${pad}${key}:\n`;
      out += stringify(value as Record<string, unknown>, indent + 1);
    }
  }

  return out;
}

function formatValue(v: unknown): string {
  if (typeof v === "string") {
    if (v.includes(":") || v.includes("#") || v.includes("'") || v.includes('"')) {
      return `"${v.replace(/"/g, '\\"')}"`;
    }
    return v;
  }
  if (v === null || v === undefined) return "";
  return String(v);
}
