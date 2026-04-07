import { useEffect, useState, type ReactNode } from "react";

import { Box, Flex, Tabs } from "@chakra-ui/react";
import { LuArchive, LuBriefcase, LuCircleUser } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ArchivedVolunteer, StaffMember, Volunteer } from "@/types/volunteer";

import { ArchivedList } from "./ArchivedList";
import { ArchivedProfilePanel } from "./ArchivedProfilePanel";
import { StaffList } from "./StaffList";
import { StaffProfilePanel } from "./StaffProfilePanel";
import { BulkActionBar } from "./BulkActionBar";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { Pagination } from "./Pagination";
import { VolunteerList } from "./VolunteerList";
import { VolunteerProfilePanel } from "./VolunteerProfilePanel";

type ViewMode = "list" | "split";
type ActiveTab = "volunteers" | "staff" | "archived";

interface VolunteerManagementViewProps {
  debouncedQuery: string;
}

const TABS: { value: ActiveTab; icon: ReactNode; label: string }[] = [
  { value: "volunteers", icon: <LuCircleUser />, label: "Volunteer" },
  { value: "staff", icon: <LuBriefcase />, label: "Staff" },
  { value: "archived", icon: <LuArchive />, label: "Archived" },
];

export const VolunteerManagementView = ({ debouncedQuery }: VolunteerManagementViewProps) => {
  const { backend } = useBackendContext();
  const [activeTab, setActiveTab] = useState<ActiveTab>("volunteers");

  // Volunteers tab state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [page, setPage] = useState(1);

  // Staff tab state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [staffPage, setStaffPage] = useState(1);
  const [selectedStaffMember, setSelectedStaffMember] = useState<StaffMember | null>(null);
  const [staffViewMode, setStaffViewMode] = useState<ViewMode>("list");

  // Archived tab state
  const [archivedVolunteers, setArchivedVolunteers] = useState<ArchivedVolunteer[]>([]);
  const [archivedPage, setArchivedPage] = useState(1);
  const [selectedArchivedVolunteer, setSelectedArchivedVolunteer] = useState<ArchivedVolunteer | null>(null);
  const [archivedViewMode, setArchivedViewMode] = useState<ViewMode>("list");

  // Shared state
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fuzzyMatch = (query: string, target: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    let qi = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t[ti] === q[qi]) qi++;
    }
    return qi === q.length;
  };

  const filteredVolunteers = debouncedQuery
    ? volunteers.filter((v) => fuzzyMatch(debouncedQuery, `${v.firstName} ${v.lastName}`))
    : volunteers;

  useEffect(() => {
    setPage(1);
  }, [filteredVolunteers.length]);

  useEffect(() => {
    setCheckedIds(new Set());
    setSelectedArchivedVolunteer(null);
    setArchivedViewMode("list");
    setSelectedStaffMember(null);
    setStaffViewMode("list");
  }, [activeTab]);

  useEffect(() => {
    (async () => {
      const res = await backend.get<Volunteer[]>("/volunteers");
      setVolunteers(res.data);
    })();
  }, [backend]);

  const volunteersTable = (
    <Flex gap={6}>
      <Box
        w={viewMode === "split" ? "50%" : "100%"}
        minW={viewMode === "split" ? "300px" : undefined}
        h="100%"
        overflowY="auto"
        onClick={(e) => {
          if (viewMode === "split" && e.target === e.currentTarget) {
            setViewMode("list");
            setSelectedVolunteer(null);
          }
        }}
      >
        <VolunteerList
          variant={viewMode === "list" ? "table" : "list"}
          refreshId={refreshTrigger}
          onSelect={(volunteer) => {
            if (selectedVolunteer?.id === volunteer.id) {
              setSelectedVolunteer(null);
              setViewMode("list");
            } else {
              setSelectedVolunteer(volunteer);
              setViewMode("split");
            }
          }}
          selectedId={selectedVolunteer?.id}
          volunteers={filteredVolunteers}
          setVolunteers={setVolunteers}
          checkedIds={checkedIds}
          setCheckedIds={setCheckedIds}
          page={page}
          setPage={setPage}
        />
      </Box>

      {viewMode === "split" && (
        <Box w="50%" h="100%" overflowY="auto" p={6}>
          <VolunteerProfilePanel
            showBack
            onBack={() => setViewMode("list")}
            volunteer={selectedVolunteer}
            onConfirm={(data) => {
              if (!selectedVolunteer) return;
              setSelectedVolunteer((prev) => prev ? { ...prev, ...data } : prev);
              setRefreshTrigger((prev) => prev + 1);
            }}
          />
        </Box>
      )}
    </Flex>
  );

  const paginationCount =
    activeTab === "archived" ? archivedVolunteers.length :
    activeTab === "staff" ? staffMembers.length :
    filteredVolunteers.length;
  const currentPage =
    activeTab === "archived" ? archivedPage :
    activeTab === "staff" ? staffPage :
    page;
  const onPageChange =
    activeTab === "archived" ? setArchivedPage :
    activeTab === "staff" ? setStaffPage :
    setPage;

  return (
    <Box h="100%" position="relative">
      <Tabs.Root
        defaultValue="volunteers"
        variant="outline"
        onValueChange={(e) => setActiveTab(e.value as ActiveTab)}
      >
        <Tabs.List w="fit-content">
          {TABS.map(({ value, icon, label }) => (
            <Tabs.Trigger key={value} value={value} color="#52525B" _selected={{ color: "#27272A", bg: "white" }}>
              <Flex align="center" gap={1}>{icon} {label}</Flex>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="volunteers" p={0} pt={0} border="1px solid #E4E4E7">
          {volunteersTable}
        </Tabs.Content>
        <Tabs.Content value="staff" p={0} border="1px solid #E4E4E7">
          <Flex gap={6}>
            <Box
              w={staffViewMode === "split" ? "50%" : "100%"}
              minW={staffViewMode === "split" ? "300px" : undefined}
              h="100%"
              overflowY="auto"
            >
              <StaffList
                variant={staffViewMode === "split" ? "list" : "table"}
                page={staffPage}
                setPage={setStaffPage}
                staffMembers={staffMembers}
                setStaffMembers={setStaffMembers}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
                selectedId={selectedStaffMember?.id}
                onSelect={(member) => {
                  if (selectedStaffMember?.id === member.id) {
                    setSelectedStaffMember(null);
                    setStaffViewMode("list");
                  } else {
                    setSelectedStaffMember(member);
                    setStaffViewMode("split");
                  }
                }}
              />
            </Box>
            {staffViewMode === "split" && (
              <Box w="50%" h="100%" overflowY="auto" p={6}>
                <StaffProfilePanel
                  staff={selectedStaffMember}
                  onBack={() => {
                    setStaffViewMode("list");
                    setSelectedStaffMember(null);
                  }}
                />
              </Box>
            )}
          </Flex>
        </Tabs.Content>
        <Tabs.Content value="archived" p={0} border="1px solid #E4E4E7">
          <Flex gap={6}>
            <Box
              w={archivedViewMode === "split" ? "50%" : "100%"}
              minW={archivedViewMode === "split" ? "300px" : undefined}
              h="100%"
              overflowY="auto"
            >
              <ArchivedList
                variant={archivedViewMode === "split" ? "list" : "table"}
                page={archivedPage}
                setPage={setArchivedPage}
                archivedVolunteers={archivedVolunteers}
                setArchivedVolunteers={setArchivedVolunteers}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
                selectedId={selectedArchivedVolunteer?.id}
                onSelect={(volunteer) => {
                  if (selectedArchivedVolunteer?.id === volunteer.id) {
                    setSelectedArchivedVolunteer(null);
                    setArchivedViewMode("list");
                  } else {
                    setSelectedArchivedVolunteer(volunteer);
                    setArchivedViewMode("split");
                  }
                }}
              />
            </Box>
            {archivedViewMode === "split" && (
              <Box w="50%" h="100%" overflowY="auto" p={6}>
                <ArchivedProfilePanel
                  volunteer={selectedArchivedVolunteer}
                  onBack={() => {
                    setArchivedViewMode("list");
                    setSelectedArchivedVolunteer(null);
                  }}
                  onConfirm={async (data) => {
                    if (!selectedArchivedVolunteer) return;
                    const isStaff = selectedArchivedVolunteer.roles?.some(
                      (r) => r === "Staff" || r === "Supervisor"
                    );
                    await Promise.all([
                      isStaff
                        ? backend.put(`/admins/${selectedArchivedVolunteer.id}`, {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                          })
                        : backend.put(`/volunteers/${selectedArchivedVolunteer.id}`, {
                            first_name: data.firstName,
                            last_name: data.lastName,
                            email: data.email,
                            phone_number: data.phoneNumber,
                          }),
                      (isStaff
                        ? backend.patch(`/admins/${selectedArchivedVolunteer.id}/archive`, {
                            reactivation: data.reactivation || null,
                            notes: data.archivedNotes || null,
                          })
                        : backend.patch(`/volunteers/${selectedArchivedVolunteer.id}/archive`, {
                            reactivation: data.reactivation || null,
                            notes: data.archivedNotes || null,
                          })),
                    ]);
                    setSelectedArchivedVolunteer((prev) =>
                      prev ? { ...prev, ...data } : prev
                    );
                    setArchivedVolunteers((prev) =>
                      prev.map((v) =>
                        v.id === selectedArchivedVolunteer.id ? { ...v, ...data } : v
                      )
                    );
                  }}
                />
              </Box>
            )}
          </Flex>
        </Tabs.Content>
      </Tabs.Root>

      <Pagination
        page={currentPage}
        totalCount={paginationCount}
        onPageChange={onPageChange}
      />

      {checkedIds.size > 0 && (
        <BulkActionBar
          count={checkedIds.size}
          showArchive={activeTab !== "archived"}
          showUnarchive={activeTab === "archived"}
          onUnarchive={async () => {
            const toUnarchive = archivedVolunteers.filter((v) => checkedIds.has(v.id));

            setArchivedVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
            setCheckedIds(new Set());

            await Promise.all(
              toUnarchive.map((v) =>
                v.roles?.some((r) => r === "Staff" || r === "Supervisor")
                  ? backend.patch(`/admins/${v.id}/unarchive`)
                  : backend.patch(`/volunteers/${v.id}/unarchive`)
              )
            );
          }}
          onDelete={() => setDeleteModalOpen(true)}
          onArchive={async () => {
            const now = new Date().toISOString();

            if (activeTab === "staff") {
              const toArchive = staffMembers.filter((s) => checkedIds.has(s.id));

              setStaffMembers((prev) => prev.filter((s) => !checkedIds.has(s.id)));
              setArchivedVolunteers((prev) => [
                ...prev,
                ...toArchive.map((s) => ({
                  id: s.id,
                  firstName: s.firstName,
                  lastName: s.lastName,
                  email: s.email,
                  roles: [s.role],
                  archivedDate: now,
                  reactivation: undefined,
                  archivedNotes: undefined,
                })),
              ]);
              setCheckedIds(new Set());

              await Promise.all(
                toArchive.map((s) => backend.patch(`/admins/${s.id}/archive`))
              );
            } else {
              const toArchive = volunteers.filter((v) => checkedIds.has(v.id));

              setVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
              setArchivedVolunteers((prev) => [
                ...prev,
                ...toArchive.map((v) => ({
                  id: v.id,
                  firstName: v.firstName,
                  lastName: v.lastName,
                  email: v.email,
                  roles: v.roles,
                  archivedDate: now,
                  reactivation: undefined,
                  archivedNotes: undefined,
                })),
              ]);

              if (selectedVolunteer && checkedIds.has(selectedVolunteer.id)) {
                setSelectedVolunteer(null);
                setViewMode("list");
              }
              setCheckedIds(new Set());

              await Promise.all(
                toArchive.map((v) => backend.patch(`/volunteers/${v.id}/archive`))
              );
            }
          }}
          onClear={() => setCheckedIds(new Set())}
        />
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        count={checkedIds.size}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await Promise.all(
            [...checkedIds].map((id) => backend.delete(`/volunteers/${id}`))
          );
          setVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
          if (selectedVolunteer && checkedIds.has(selectedVolunteer.id)) {
            setSelectedVolunteer(null);
            setViewMode("list");
          }
          setCheckedIds(new Set());
          setDeleteModalOpen(false);
        }}
      />
    </Box>
  );
};
