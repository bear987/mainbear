/**
 * Guards that run before anything is written to disk.
 *
 * The sites cast their JSON to hand-written TypeScript types, so a save that
 * changes the SHAPE of the data would make those types a lie and could break
 * a live build. Rather than maintain a second copy of every type, the current
 * file on disk is used as the template: values may be edited freely, list
 * items may be added and removed, but the structure has to hold.
 */

export type Problem = { path: string; message: string };

const DASHES = /[–—]/; // en dash, em dash

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function label(p: string): string {
  return p === "" ? "the file" : p;
}

/**
 * Compare a proposed value against the version currently on disk.
 * `template` is the shape to hold to; `next` is what the editor produced.
 *
 * `nullOk` says whether emptying this particular field is allowed. It is not a
 * blanket permission: the data itself decides. A field that is already null
 * somewhere, or missing from some entries, is one the site copes without. A
 * field every entry carries is one the site reads, and emptying it would make
 * the site's types a lie.
 */
export function checkShape(template: unknown, next: unknown, at = "", nullOk = false): Problem[] {
  const problems: Problem[] = [];

  const tType = typeOf(template);
  const nType = typeOf(next);

  // A value that is absent in the template (a newly added optional field, or
  // a list item built from scratch) has nothing to be checked against.
  if (template === undefined) return problems;

  if (tType !== nType) {
    if (tType === "null") {
      // The template says nothing about the type, so anything may fill it.
    } else if (nType === "null") {
      if (!nullOk) {
        problems.push({
          path: label(at),
          message: `needs a ${tType} and cannot be left empty`,
        });
      }
      return problems;
    } else {
      problems.push({
        path: label(at),
        message: `should still be ${tType}, but it is now ${nType}`,
      });
      return problems;
    }
  }

  if (tType === "object" && nType === "object") {
    const t = template as Record<string, unknown>;
    const n = next as Record<string, unknown>;

    for (const key of Object.keys(t)) {
      if (!(key in n)) {
        problems.push({
          path: label(at ? `${at}.${key}` : key),
          message: "is missing, the site reads this field",
        });
        continue;
      }
      problems.push(...checkShape(t[key], n[key], at ? `${at}.${key}` : key));
    }
    return problems;
  }

  if (tType === "array" && nType === "array") {
    const t = template as unknown[];
    const n = next as unknown[];
    if (t.length === 0) return problems;

    const objectItems = t.filter(
      (i): i is Record<string, unknown> => i !== null && typeof i === "object" && !Array.isArray(i),
    );

    // Scalar lists: every entry just has to stay the same kind of value.
    if (objectItems.length === 0) {
      const first = t.find((item) => item !== null);
      const holesAllowed = t.some((item) => item === null);
      n.forEach((item, i) => {
        problems.push(...checkShape(first, item, `${at}[${i + 1}]`, holesAllowed));
      });
      return problems;
    }

    // Lists of objects carry OPTIONAL fields: a dish may have no tags, a
    // vehicle that is coming soon has no engine. So the template is merged
    // from every existing entry, and only the keys that appear in ALL of them
    // are treated as required.
    const byKey = new Map<string, unknown>();
    for (const item of objectItems) {
      for (const [key, value] of Object.entries(item)) {
        if (!byKey.has(key) && value !== null) byKey.set(key, value);
      }
    }
    const required = [...byKey.keys()].filter((key) =>
      objectItems.every((item) => key in item),
    );

    // A key that some entry leaves out, or already holds null for, is one the
    // site renders without: a stat with no figure to count up, a Sunday with
    // no opening time. Those may be emptied. A key every entry carries, like a
    // price, may not.
    const emptyAllowed = new Set(
      [...byKey.keys()].filter(
        (key) => !objectItems.every((item) => key in item && item[key] !== null),
      ),
    );

    n.forEach((item, i) => {
      const where = `${at}[${i + 1}]`;
      if (item === null || typeof item !== "object" || Array.isArray(item)) {
        problems.push({ path: label(where), message: "should be an entry with fields" });
        return;
      }
      const record = item as Record<string, unknown>;
      for (const key of required) {
        if (!(key in record)) {
          problems.push({
            path: label(`${where}.${key}`),
            message: "is missing, the site reads this field",
          });
        }
      }
      for (const [key, value] of Object.entries(record)) {
        const keyTemplate = byKey.get(key);
        if (keyTemplate === undefined) continue; // a field none of the originals had
        problems.push(
          ...checkShape(keyTemplate, value, `${where}.${key}`, emptyAllowed.has(key)),
        );
      }
    });
    return problems;
  }

  return problems;
}

/**
 * The owner's standing rule: no em dashes or en dashes in copy, they read as
 * machine-written. Enforced at the point of saving so it cannot slip onto a
 * live site.
 */
export function checkDashes(value: unknown, at = ""): Problem[] {
  const problems: Problem[] = [];

  if (typeof value === "string") {
    if (DASHES.test(value)) {
      problems.push({
        path: label(at),
        message: "contains a long dash. Use a comma, or split the sentence.",
      });
    }
    return problems;
  }

  if (Array.isArray(value)) {
    value.forEach((item, i) => problems.push(...checkDashes(item, `${at}[${i + 1}]`)));
    return problems;
  }

  if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      problems.push(...checkDashes(v, at ? `${at}.${key}` : key));
    }
  }

  return problems;
}

export function validate(template: unknown, next: unknown): Problem[] {
  return [...checkShape(template, next), ...checkDashes(next)];
}
