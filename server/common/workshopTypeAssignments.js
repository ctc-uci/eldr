import { keysToCamel } from "@/common/utils";
import { db } from "@/db/db-pgp";
import { verifyRole } from "@/middleware";

const assignmentConfigs = {
  clinic: {
    idParam: "clinicId",
    mutationRole: "staff",
    insertQuery: `INSERT INTO clinic_workshop_types (clinic_id, workshop_type_id)
                  VALUES ($1, $2)
                  ON CONFLICT (clinic_id, workshop_type_id) DO NOTHING
                  RETURNING *`,
    deleteQuery: `DELETE FROM clinic_workshop_types
                  WHERE clinic_id = $1 AND workshop_type_id = $2
                  RETURNING *`,
    selectQuery: `SELECT wt.id, wt.workshop_type
                  FROM clinic_workshop_types assignment
                  JOIN workshop_types wt ON assignment.workshop_type_id = wt.id
                  WHERE assignment.clinic_id = $1`,
  },
  volunteer: {
    idParam: "volunteerId",
    mutationRole: "volunteer",
    insertQuery: `INSERT INTO volunteer_workshop_types (volunteer_id, workshop_type_id)
                  VALUES ($1, $2)
                  ON CONFLICT (volunteer_id, workshop_type_id) DO NOTHING
                  RETURNING *`,
    deleteQuery: `DELETE FROM volunteer_workshop_types
                  WHERE volunteer_id = $1 AND workshop_type_id = $2
                  RETURNING *`,
    selectQuery: `SELECT wt.id, wt.workshop_type
                  FROM volunteer_workshop_types assignment
                  JOIN workshop_types wt ON assignment.workshop_type_id = wt.id
                  WHERE assignment.volunteer_id = $1`,
  },
};

const isPositiveIntegerId = (value) =>
  (typeof value === "number" && Number.isInteger(value) && value > 0) ||
  (typeof value === "string" && /^[1-9]\d*$/.test(value));

export const registerWorkshopTypeAssignmentRoutes = (
  router,
  ownerType,
  authorizeMutation
) => {
  const config = assignmentConfigs[ownerType];
  if (!config) throw new Error(`Unsupported workshop type owner: ${ownerType}`);

  const basePath = `/:${config.idParam}/workshop-types`;
  const getOwnerId = (req) => req.params[config.idParam];
  const canMutate = (req, res) =>
    !authorizeMutation || authorizeMutation(req, res);

  router.post(basePath, verifyRole(config.mutationRole), async (req, res) => {
    try {
      const ownerId = getOwnerId(req);
      const { workshopTypeId } = req.body;

      if (!canMutate(req, res)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      if (
        !isPositiveIntegerId(ownerId) ||
        !isPositiveIntegerId(workshopTypeId)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid owner or workshop type ID" });
      }

      const relationship = await db.query(config.insertQuery, [
        ownerId,
        workshopTypeId,
      ]);

      if (relationship.length === 0) {
        return res
          .status(409)
          .json({ message: "Workshop type already assigned" });
      }

      res.status(201).json(keysToCamel(relationship));
    } catch (error) {
      if (error.code === "23503") {
        return res
          .status(400)
          .json({ message: "Invalid owner or workshop type ID" });
      }

      console.error(`Error assigning workshop type to ${ownerType}:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete(
    `${basePath}/:workshopTypeId`,
    verifyRole(config.mutationRole),
    async (req, res) => {
      try {
        const ownerId = getOwnerId(req);
        const { workshopTypeId } = req.params;

        if (!canMutate(req, res)) {
          return res.status(403).json({ message: "Forbidden" });
        }

        if (
          !isPositiveIntegerId(ownerId) ||
          !isPositiveIntegerId(workshopTypeId)
        ) {
          return res
            .status(400)
            .json({ message: "Invalid owner or workshop type ID" });
        }

        const relationship = await db.query(config.deleteQuery, [
          ownerId,
          workshopTypeId,
        ]);

        if (relationship.length === 0) {
          return res.status(404).json({
            message: `Workshop type not assigned to this ${ownerType}`,
          });
        }

        res.status(200).json(keysToCamel(relationship));
      } catch (error) {
        console.error(`Error removing workshop type from ${ownerType}:`, error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  router.get(basePath, verifyRole("volunteer"), async (req, res) => {
    try {
      const ownerId = getOwnerId(req);
      const workshopTypes = await db.query(config.selectQuery, [ownerId]);

      res.status(200).json(keysToCamel(workshopTypes));
    } catch (error) {
      console.error(`Error fetching workshop types for ${ownerType}:`, error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
