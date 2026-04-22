import { useEffect, useState, type ReactNode } from "react";

import { Box, Flex, Tabs } from "@chakra-ui/react";
import { LuArchive, LuBriefcase, LuCircleUser } from "react-icons/lu";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";
import { ArchivedVolunteer, StaffMember, Volunteer } from "@/types/volunteer";
import { FilterState } from "./FilterDrawer";

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
  filters: FilterState;
}

const TABS: { value: ActiveTab; icon: ReactNode; label: string }[] = [
  { value: "volunteers", icon: <LuCircleUser />, label: "Volunteer" },
  { value: "staff", icon: <LuBriefcase />, label: "Staff" },
  { value: "archived", icon: <LuArchive />, label: "Archived" },
];

export const VolunteerManagementView = ({ debouncedQuery, filters }: VolunteerManagementViewProps) => {
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
  const [archivedCheckedKeys, setArchivedCheckedKeys] = useState<Set<string>>(new Set());
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

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch = !debouncedQuery || fuzzyMatch(debouncedQuery, `${v.firstName} ${v.lastName}`);
    const matchesRoles = filters.roles.size === 0 || v.roles?.some((r) => filters.roles.has(r));
    const matchesInterests = filters.interests.size === 0 || v.areasOfPractice?.some((a) => filters.interests.has(a));
    const matchesLanguages = filters.languages.size === 0 || v.languages?.some((l) => filters.languages.has(l));
    return matchesSearch && matchesRoles && matchesInterests && matchesLanguages;
  });

  const filteredStaff = staffMembers.filter((s) => {
    const matchesSearch = !debouncedQuery || fuzzyMatch(debouncedQuery, `${s.firstName} ${s.lastName}`);
    const matchesRoles = filters.roles.size === 0 || filters.roles.has(s.role);
    return matchesSearch && matchesRoles;
  });

  const filteredArchived = archivedVolunteers.filter((v) => {
    const matchesSearch = !debouncedQuery || fuzzyMatch(debouncedQuery, `${v.firstName} ${v.lastName}`);
    const matchesRoles = filters.roles.size === 0 || v.roles?.some((r) => filters.roles.has(r));
    return matchesSearch && matchesRoles;
  });

  useEffect(() => {
    setPage(1);
  }, [filteredVolunteers.length]);

  useEffect(() => {
    setStaffPage(1);
  }, [filteredStaff.length]);

  useEffect(() => {
    setArchivedPage(1);
  }, [filteredArchived.length]);

  useEffect(() => {
    setCheckedIds(new Set());
    setArchivedCheckedKeys(new Set());
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
    activeTab === "archived" ? filteredArchived.length :
    activeTab === "staff" ? filteredStaff.length :
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
                staffMembers={filteredStaff}
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
                  onSaved={(data) => {
                    setSelectedStaffMember((prev) => prev ? { ...prev, ...data } : prev);
                    setStaffMembers((prev) =>
                      prev.map((s) => s.id === selectedStaffMember?.id ? { ...s, ...data } : s)
                    );
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
                archivedVolunteers={filteredArchived}
                setArchivedVolunteers={setArchivedVolunteers}
                checkedKeys={archivedCheckedKeys}
                setCheckedKeys={setArchivedCheckedKeys}
                selectedKey={selectedArchivedVolunteer?.listKey}
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
                  onConfirm={(data) => {
                    if (!selectedArchivedVolunteer) return;
                    const updated = { ...selectedArchivedVolunteer, ...data };
                    setSelectedArchivedVolunteer(updated);
                    setArchivedVolunteers((prev) =>
                      prev.map((v) => v.id === selectedArchivedVolunteer.id ? updated : v)
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

      {(checkedIds.size > 0 || archivedCheckedKeys.size > 0) && (
        <BulkActionBar
          count={activeTab === "archived" ? archivedCheckedKeys.size : checkedIds.size}
          showArchive={activeTab !== "archived"}
          showUnarchive={activeTab === "archived"}
          onUnarchive={async () => {
            const toUnarchive = archivedVolunteers.filter((v) => archivedCheckedKeys.has(v.listKey));

            setArchivedVolunteers((prev) => prev.filter((v) => !archivedCheckedKeys.has(v.listKey)));

            const restoredVolunteers = toUnarchive.filter((v) => v.source === "volunteer");
            const restoredStaff = toUnarchive.filter((v) => v.source === "staff");

            if (restoredVolunteers.length > 0) {
              setVolunteers((prev) => [
                ...prev,
                ...restoredVolunteers.map((v) => ({
                  id: v.id,
                  firstName: v.firstName,
                  lastName: v.lastName,
                  email: v.email,
                  phoneNumber: v.phoneNumber,
                  roles: v.roles,
                })),
              ]);
            }
            if (restoredStaff.length > 0) {
              setStaffMembers((prev) => [
                ...prev,
                ...restoredStaff.map((v) => ({
                  id: v.id,
                  firstName: v.firstName,
                  lastName: v.lastName,
                  email: v.email,
                  role: v.roles?.[0] ?? "",
                  phoneNumber: v.phoneNumber,
                })),
              ]);
            }

            setArchivedCheckedKeys(new Set());

            await Promise.all(
              toUnarchive.map((v) =>
                v.source === "staff"
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
              const prevStaff = [...staffMembers];
              const prevArchived = [...archivedVolunteers];
              const prevChecked = new Set(checkedIds);

              setStaffMembers((prev) => prev.filter((s) => !checkedIds.has(s.id)));
              setArchivedVolunteers((prev) => [
                ...prev,
                ...toArchive.map((s) => ({
                  id: s.id,
                  listKey: `s-${s.id}`,
                  source: "staff" as const,
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

              try {
                await Promise.all(
                  toArchive.map((s) => backend.patch(`/admins/${s.id}/archive`))
                );
              } catch (err) {
                console.error("Failed to archive staff:", err);
                setStaffMembers(prevStaff);
                setArchivedVolunteers(prevArchived);
                setCheckedIds(prevChecked);
              }
            } else {
              const toArchive = volunteers.filter((v) => checkedIds.has(v.id));
              const prevVolunteers = [...volunteers];
              const prevArchived = [...archivedVolunteers];
              const prevChecked = new Set(checkedIds);

              setVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
              setArchivedVolunteers((prev) => [
                ...prev,
                ...toArchive.map((v) => ({
                  id: v.id,
                  listKey: `v-${v.id}`,
                  source: "volunteer" as const,
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

              try {
                await Promise.all(
                  toArchive.map((v) => backend.patch(`/volunteers/${v.id}/archive`))
                );
              } catch (err) {
                console.error("Failed to archive volunteers:", err);
                setVolunteers(prevVolunteers);
                setArchivedVolunteers(prevArchived);
                setCheckedIds(prevChecked);
              }
            }
          }}
          onClear={() => {
            setCheckedIds(new Set());
            setArchivedCheckedKeys(new Set());
          }}
        />
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        count={checkedIds.size}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          if (activeTab === "archived") {
            const toDelete = archivedVolunteers.filter((v) => archivedCheckedKeys.has(v.listKey));
            await Promise.all(
              toDelete.map((v) =>
                v.source === "staff"
                  ? backend.delete(`/admins/${v.id}`)
                  : backend.delete(`/volunteers/${v.id}`)
              )
            );
            setArchivedVolunteers((prev) => prev.filter((v) => !archivedCheckedKeys.has(v.listKey)));
            if (selectedArchivedVolunteer && archivedCheckedKeys.has(selectedArchivedVolunteer.listKey)) {
              setSelectedArchivedVolunteer(null);
              setArchivedViewMode("list");
            }
            setArchivedCheckedKeys(new Set());
          } else if (activeTab === "staff") {
            await Promise.all(
              [...checkedIds].map((id) => backend.delete(`/admins/${id}`))
            );
            setStaffMembers((prev) => prev.filter((s) => !checkedIds.has(s.id)));
            if (selectedStaffMember && checkedIds.has(selectedStaffMember.id)) {
              setSelectedStaffMember(null);
              setStaffViewMode("list");
            }
            setCheckedIds(new Set());
          } else {
            await Promise.all(
              [...checkedIds].map((id) => backend.delete(`/volunteers/${id}`))
            );
            setVolunteers((prev) => prev.filter((v) => !checkedIds.has(v.id)));
            if (selectedVolunteer && checkedIds.has(selectedVolunteer.id)) {
              setSelectedVolunteer(null);
              setViewMode("list");
            }
            setCheckedIds(new Set());
          }
          setDeleteModalOpen(false);
        }}
      />
    </Box>
  );
};
