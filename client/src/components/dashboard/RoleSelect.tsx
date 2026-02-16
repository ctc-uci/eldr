import { ChangeEvent, useCallback, useState } from "react";

import { NativeSelect } from "@chakra-ui/react";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { User } from "@/types/user";

interface RoleSelectProps {
  user: User;
  disabled?: boolean;
}

export const RoleSelect = ({ user, disabled = true }: RoleSelectProps) => {
  const { backend } = useBackendContext();

  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleChangeRole = useCallback(
    async (e: ChangeEvent<HTMLSelectElement>) => {
      const updatedRole = e.currentTarget.value;
      setLoading(true);

      try {
        await backend.put("/users/update/set-role", {
          role: updatedRole,
          firebaseUid: user.firebaseUid,
        });

        if (updatedRole !== "user" && updatedRole !== "admin") {
          throw Error("Role is not valid");
        }

        setRole(updatedRole);

      } catch (error) {
        console.error("Error updating user role:", error);

      } finally {
        setLoading(false);
      }
    },
    [backend, role, user.firebaseUid]
  );

  return (
    <NativeSelect.Root
    >
      <NativeSelect.Field
        placeholder="Select role"
        value={role}
        onChange={handleChangeRole}
        disabled={loading || disabled}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};
