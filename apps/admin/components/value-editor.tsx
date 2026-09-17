"use client";

import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  type Control,
  FIELD_NOTES,
  blankLike,
  controlFor,
  humanise,
  isReadOnly,
  itemTitle,
} from "@/lib/fields";

type Props = {
  /** The JSON key this value sits under, used for its label and its control. */
  name: string;
  value: unknown;
  onChange: (next: unknown) => void;
  /** How deep in the tree, for indentation only. */
  depth?: number;
};

function Note({ name }: { name: string }) {
  const note = FIELD_NOTES[name];
  if (!note) return null;
  return <p className="mt-1 text-xs text-muted">{note}</p>;
}

/**
 * A number box that holds its own text while it is being typed into.
 *
 * It matters because of what happens to an EMPTY box. Emptying it used to put
 * null into the data straight away, the editor then saw null and drew a plain
 * text box in its place, and the figure typed next was stored as text. The
 * save was refused, correctly but bafflingly, for a price the owner had only
 * retyped. So the box now keeps the old value until it is left empty, and the
 * field it lives in stays a number field either way.
 */
function NumberBox({
  value,
  readOnly,
  onChange,
}: {
  value: unknown;
  readOnly: boolean;
  onChange: (next: unknown) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === null || value === undefined ? "" : String(value));

  return (
    <input
      type="number"
      className="field"
      value={shown}
      readOnly={readOnly}
      onChange={(e) => {
        const text = e.target.value;
        setDraft(text);
        if (text.trim() === "") return; // mid-edit, keep the number we had
        const parsed = Number(text);
        if (Number.isFinite(parsed)) onChange(parsed);
      }}
      onBlur={() => {
        // Left empty on purpose: clear it, and let the save tell the owner if
        // this is a field the site cannot do without.
        if (draft !== null && draft.trim() === "") onChange(null);
        setDraft(null);
      }}
    />
  );
}

function Scalar({ name, value, onChange }: Props) {
  // Chosen once, from the value as it arrived, and then kept. Re-deciding on
  // every keystroke is what turned a cleared number into text, and it also
  // swapped the box out from under the cursor when a line grew past 90
  // characters.
  const [control] = useState<Control>(() => controlFor(name, value));
  const readOnly = isReadOnly(name);

  if (control === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-body">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-[var(--color-accent)]"
        />
        {humanise(name)}
      </label>
    );
  }

  // A field that arrived as null is one the site knows how to do without, so
  // emptying it again has to mean null rather than an empty string.
  const emptyIsNull = control === "null";
  const text = (next: string) => onChange(next === "" && emptyIsNull ? null : next);

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
        {humanise(name)}
      </span>

      {control === "textarea" ? (
        <textarea
          className="field"
          value={String(value ?? "")}
          readOnly={readOnly}
          onChange={(e) => text(e.target.value)}
        />
      ) : control === "number" ? (
        <NumberBox value={value} readOnly={readOnly} onChange={onChange} />
      ) : (
        <input
          type="text"
          className="field"
          placeholder={emptyIsNull ? "not set" : undefined}
          value={String(value ?? "")}
          readOnly={readOnly}
          onChange={(e) => text(e.target.value)}
        />
      )}

      <Note name={name} />
    </label>
  );
}

/**
 * One entry in a list of plain values: a paragraph, a bullet, a figure.
 *
 * The control comes from the name of the LIST, so that a paragraph added to
 * `body` gets a proper box from the first character rather than growing into
 * one at ninety and throwing the cursor out as it does.
 */
function SimpleItem({
  listName,
  value,
  onChange,
  onRemove,
  index,
}: {
  listName: string;
  value: unknown;
  onChange: (next: unknown) => void;
  onRemove: () => void;
  index: number;
}) {
  const [control] = useState<Control>(() => controlFor(listName, value));

  return (
    <div className="flex items-start gap-2">
      {control === "number" ? (
        <NumberBox value={value} readOnly={false} onChange={onChange} />
      ) : control === "textarea" ? (
        <textarea
          className="field"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          className="field"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      <button
        type="button"
        className="btn btn-danger shrink-0"
        onClick={onRemove}
        aria-label={`Remove entry ${index + 1}`}
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function ListEditor({ name, value, onChange, depth = 0 }: Props) {
  const items = value as unknown[];
  const [open, setOpen] = useState<number | null>(items.length === 1 ? 0 : null);

  const replace = (index: number, next: unknown) => {
    const copy = [...items];
    copy[index] = next;
    onChange(copy);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setOpen(null);
  };

  const add = () => {
    const template = items[0];
    onChange([...items, template === undefined ? "" : blankLike(template)]);
    setOpen(items.length);
  };

  const simple = items.every((i) => typeof i !== "object" || i === null);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">
          {humanise(name)}
          <span className="ml-2 normal-case text-muted/70">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </span>
        </span>
        <button type="button" className="btn" onClick={add}>
          <Plus className="size-3.5" /> Add
        </button>
      </div>

      <Note name={name} />

      {simple ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <SimpleItem
              key={index}
              listName={name}
              index={index}
              value={item}
              onChange={(next) => replace(index, next)}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <div key={index} className="rounded-md border border-line bg-panel">
                <div className="flex items-center gap-2 px-3 py-2">
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left text-sm text-heading"
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    {expanded ? (
                      <ChevronDown className="size-4 shrink-0 text-muted" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 text-muted" />
                    )}
                    <span className="truncate">{itemTitle(item, index)}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => remove(index)}
                    aria-label={`Remove ${itemTitle(item, index)}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {expanded ? (
                  <div className="border-t border-line-soft px-3 py-3">
                    <ObjectEditor
                      value={item}
                      onChange={(next) => replace(index, next)}
                      depth={depth + 1}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ObjectEditor({
  value,
  onChange,
  depth = 0,
}: {
  value: unknown;
  onChange: (next: unknown) => void;
  depth?: number;
}) {
  const record = value as Record<string, unknown>;
  return (
    <div className="space-y-4">
      {Object.entries(record).map(([key, child]) => (
        <ValueEditor
          key={key}
          name={key}
          value={child}
          depth={depth}
          onChange={(next) => onChange({ ...record, [key]: next })}
        />
      ))}
    </div>
  );
}

export function ValueEditor({ name, value, onChange, depth = 0 }: Props) {
  if (Array.isArray(value)) {
    return (
      <div className="rounded-md border border-line-soft p-3">
        <ListEditor name={name} value={value} onChange={onChange} depth={depth} />
      </div>
    );
  }

  if (value !== null && typeof value === "object") {
    return (
      <fieldset className="rounded-md border border-line-soft p-3">
        <legend className="px-1 text-xs font-semibold tracking-wide text-heading uppercase">
          {humanise(name)}
        </legend>
        <ObjectEditor value={value} onChange={onChange} depth={depth + 1} />
      </fieldset>
    );
  }

  return <Scalar name={name} value={value} onChange={onChange} depth={depth} />;
}
