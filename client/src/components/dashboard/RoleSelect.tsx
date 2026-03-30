import { ChangeEvent, useCallback, useState } from "react";

import { NativeSelect } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { User } from "@/types/user";

interface RoleSelectProps {
  user: User;
  disabled?: boolean;
}

const VALID_ROLES: User["role"][] = ["guest", "volunteer", "staff", "supervisor"];

export const RoleSelect = ({ user, disabled = true }: RoleSelectProps) => {
  const { backend } = useBackendContext();

  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleChangeRole = useCallback(
    async (e: ChangeEvent<HTMLSelectElement>) => {
      const updatedRole = e.currentTarget.value;

      if (!VALID_ROLES.includes(updatedRole as User["role"])) {
        console.error("Error updating user role: Role is not valid");
        return;
      }

      setLoading(true);

      try {
        await backend.put("/users/update/set-role", {
          role: updatedRole,
          firebaseUid: user.firebaseUid,
        });
        setRole(updatedRole as User["role"]);

      } catch (error) {
        console.error("Error updating user role:", error);

      } finally {
        setLoading(false);
      }
    },
    [backend, user.firebaseUid]
  );

  return (
    <NativeSelect.Root
      disabled={loading || disabled}
    >
      <NativeSelect.Field
        placeholder="Select role"
        value={role}
        onChange={handleChangeRole}
      >
        <option value="guest">Guest</option>
        <option value="volunteer">Volunteer</option>
        <option value="staff">Staff</option>
        <option value="supervisor">Supervisor</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};
