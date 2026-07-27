import { db } from "@/db/db-pgp";
import { Router } from "express";
import { keysToCamel } from "@/common/utils";

export const tagsRouter = Router();

// Create a new tag
tagsRouter.post("/", async (req, res) => {
  try {
    const { text, description } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).send("Tag text is required");
    }

    const tagResult = await db.query(
      `
      INSERT INTO public.tags (tag, description)
      VALUES ($1, $2)
      RETURNING id, tag, description;
      `,
      [text.trim(), description?.trim() || null]
    );

    res.status(201).json(keysToCamel(tagResult));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get all tags with case, clinic (event), and volunteer counts
tagsRouter.get("/", async (req, res) => {
  try {
    const searchRaw = typeof req.query.search === "string" ? req.query.search : null;
    const search = searchRaw?.trim() ? searchRaw.trim() : null;
    const sort = req.query.sort;

    let orderClause = "ORDER BY LOWER(t.tag) ASC";
    if (sort === "most-used") {
      orderClause =
        "ORDER BY (COUNT(DISTINCT ct.case_id) + COUNT(DISTINCT clt.clinic_id) + COUNT(DISTINCT vt.volunteer_id)) DESC";
    } else if (sort === "recent") {
      orderClause = "ORDER BY t.id DESC";
    }

    const tagsQuery = await db.query(
      `
      SELECT
        t.id,
        t.tag,
        t.description,
        COUNT(DISTINCT ct.case_id)::int       AS case_count,
        COUNT(DISTINCT clt.clinic_id)::int    AS clinic_count,
        COUNT(DISTINCT vt.volunteer_id)::int  AS volunteer_count
      FROM public.tags t
      LEFT JOIN public.case_tags ct    ON ct.tag_id = t.id
      LEFT JOIN public.clinic_tags clt ON clt.tag_id = t.id
      LEFT JOIN public.volunteer_tags vt ON vt.tag_id = t.id
      WHERE ($1::text IS NULL OR t.tag ILIKE '%' || $1 || '%')
      GROUP BY t.id, t.tag, t.description
      ${orderClause};
      `,
      [search]
    );

    res.status(200).json(keysToCamel(tagsQuery));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Get a single tag via ID with counts
tagsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const tagQuery = await db.query(
      `
      SELECT
        t.id,
        t.tag,
        t.description,
        COUNT(DISTINCT ct.case_id)::int       AS case_count,
        COUNT(DISTINCT clt.clinic_id)::int    AS clinic_count,
        COUNT(DISTINCT vt.volunteer_id)::int  AS volunteer_count
      FROM public.tags t
      LEFT JOIN public.case_tags ct    ON ct.tag_id = t.id
      LEFT JOIN public.clinic_tags clt ON clt.tag_id = t.id
      LEFT JOIN public.volunteer_tags vt ON vt.tag_id = t.id
      WHERE t.id = $1
      GROUP BY t.id, t.tag, t.description;
      `,
      [id]
    );

    res.status(200).json(keysToCamel(tagQuery));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update a tag via ID
tagsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { text, description } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).send("Tag text is required");
    }

    await db.query(
      `
      UPDATE public.tags
      SET tag = $2, description = $3
      WHERE id = $1;
      `,
      [id, text.trim(), description?.trim() || null]
    );

    res.status(200).send(`Tag ${id} updated successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete a single tag via ID
tagsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM public.tags
      WHERE id = $1;
      `,
      [id]
    );

    res.status(200).send(`Tag ${id} deleted successfully`);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
