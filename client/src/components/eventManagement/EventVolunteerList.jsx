import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Input,
  InputGroup,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";

import { LuDownload, LuSearch, LuTrash2 } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ConfirmDialog } from "./ConfirmDialog";

const volunteerDisplayRole = (row) => {
  if (row?.isAttorney) return "Attorney";
  if (row?.isNotary) return "Notary";
  return "Volunteer";
};

const volunteerFullName = (row) =>
  [row?.firstName, row?.lastName].filter(Boolean).join(" ").trim() || "—";

const initialsFromName = (firstName, lastName) => {
  const a = (firstName || "").trim().charAt(0);
  const b = (lastName || "").trim().charAt(0);
  const s = `${a}${b}`.toUpperCase();
  return s || "?";
};

const PAGE_SIZE = 8;

const buildVisiblePageNumbers = (totalPages, currentPage) => {
  const all = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages <= 7) return all;
  return all.filter((p) => {
    if (p === 1 || p === totalPages) return true;
    return Math.abs(p - currentPage) <= 1;
  });
};

export const EventVolunteerList = ({ eventId }) => {
  const { backend } = useBackendContext();
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    if (!eventId) return;
    setRegistrationsLoading(true);
    try {
      const res = await backend.get(`/clinics/${eventId}/registrations`);
      setRegistrations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  }, [backend, eventId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter((row) => {
      const name = volunteerFullName(row).toLowerCase();
      const email = (row.email || "").toLowerCase();
      const role = volunteerDisplayRole(row).toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [registrations, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, registrations.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleAttendanceChange = async (volunteerId, hasAttended) => {
    try {
      await backend.patch(
        `/clinics/${eventId}/registrations/${volunteerId}/attendance`,
        { hasAttended }
      );
      setRegistrations((prev) =>
        prev.map((r) => (r.id === volunteerId ? { ...r, hasAttended } : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const confirmRemoveVolunteer = async () => {
    setDeleteLoading(true);
    try {
      await backend.delete(`/clinics/${eventId}/registrations/${deleteTarget}`);
      setRegistrations((prev) => prev.filter((r) => r.id !== deleteTarget));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    const header = ["Name", "Email", "Role", "Checked in"];
    const lines = filtered.map((row) => {
      const name = volunteerFullName(row);
      const email = row.email ?? "";
      const role = volunteerDisplayRole(row);
      const checked = row.hasAttended ? "yes" : "no";
      const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
      return [esc(name), esc(email), esc(role), esc(checked)].join(",");
    });
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-event-${eventId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visiblePages = buildVisiblePageNumbers(totalPages, page);

  return (
    <Box
      w="100%"
      border="1px solid #E2E8F0"
      borderRadius="lg"
      bg="white"
      p={{ base: 4, md: 6 }}
    >
      <Flex
        w="100%"
        gap={3}
        mb={6}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
      >
        <InputGroup
          flex={1}
          startElement={<LuSearch color="#9CA3AF" size={18} />}
        >
          <Input
            placeholder="Search volunteers by name, email, or role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            border="1px solid #E2E8F0"
            borderRadius="md"
            bg="white"
            h="44px"
            fontSize="sm"
            _placeholder={{ color: "gray.400" }}
          />
        </InputGroup>
        <Button
          variant="outline"
          borderColor="#E2E8F0"
          color="gray.700"
          borderRadius="md"
          px={4}
          h="44px"
          fontSize="sm"
          onClick={handleDownloadCsv}
        >
          <LuDownload />
          Download Volunteer List
        </Button>
      </Flex>

      <Table.ScrollArea overflowX="auto">
        <Table.Root size="sm" variant="line">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Attendance</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {registrationsLoading ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Text
                    py={8}
                    textAlign="center"
                    color="gray.500"
                    fontSize="sm"
                  >
                    Loading volunteers…
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : paginated.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4}>
                  <Text
                    py={8}
                    textAlign="center"
                    color="gray.500"
                    fontSize="sm"
                  >
                    No volunteers registered for this event.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              paginated.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>
                    <HStack
                      gap={3}
                      align="start"
                    >
                      <Flex
                        w="40px"
                        h="40px"
                        borderRadius="full"
                        bg="gray.200"
                        align="center"
                        justify="center"
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.700"
                        flexShrink={0}
                      >
                        {initialsFromName(row.firstName, row.lastName)}
                      </Flex>
                      <VStack
                        align="start"
                        gap={0}
                      >
                        <Text
                          fontWeight="semibold"
                          fontSize="sm"
                          color="gray.800"
                        >
                          {volunteerFullName(row)}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                        >
                          {row.email || "—"}
                        </Text>
                      </VStack>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      fontSize="sm"
                      color="gray.700"
                    >
                      {volunteerDisplayRole(row)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Checkbox.Root
                      checked={Boolean(row.hasAttended)}
                      onCheckedChange={(details) => {
                        const next = details.checked === true;
                        handleAttendanceChange(row.id, next);
                      }}
                      size="sm"
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>
                        <Text
                          fontSize="sm"
                          color="gray.700"
                        >
                          Checked in
                        </Text>
                      </Checkbox.Label>
                    </Checkbox.Root>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button
                      variant="ghost"
                      size="sm"
                      color="red.600"
                      onClick={() => setDeleteTarget(row.id)}
                    >
                      <LuTrash2 />
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {filtered.length > 0 && (
        <Flex
          w="100%"
          mt={4}
          justify="flex-end"
          align="center"
          gap={4}
          flexWrap="wrap"
        >
          <Text
            fontSize="sm"
            color="gray.600"
          >
            Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </Text>
          <HStack gap={1}>
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            {visiblePages.map((p, idx) => {
              const prev = visiblePages[idx - 1];
              const showEllipsis = prev != null && p - prev > 1;
              return (
                <HStack
                  key={`pg-${p}-${idx}`}
                  gap={1}
                >
                  {showEllipsis ? (
                    <Text
                      px={1}
                      color="gray.400"
                    >
                      …
                    </Text>
                  ) : null}
                  <Button
                    size="sm"
                    variant={page === p ? "solid" : "outline"}
                    colorPalette={page === p ? "blue" : "gray"}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                </HStack>
              );
            })}
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(e) => { if (!e.open) setDeleteTarget(null); }}
        title="Delete Volunteer from List"
        confirmLabel="Yes, Delete"
        onConfirm={confirmRemoveVolunteer}
        loading={deleteLoading}
      />
    </Box>
  );
};
