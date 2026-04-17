import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Button, Flex, HStack, Input, NativeSelect, Text, VStack } from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useBackendContext } from "@/contexts/hooks/useBackendContext";

import { ChooseEmailTemplateModal } from "./ChooseEmailTemplateModal";
import { EmailNotificationRichBody } from "./EmailNotificationRichBody";
import {
  addEventEmailNotification,
  buildSendTimingLabel,
  getEventEmailNotificationById,
  notifyEventEmailNotificationsChanged,
  updateEventEmailNotification,
} from "./eventEmailNotificationsStorage";

const DEFAULT_EMAIL_SUBJECT = "Confirmation Email for Volunteer";

const toEditorHtml = (raw) => {
  if (raw == null || String(raw).trim() === "") return "<p></p>";
  const t = String(raw).trim();
  if (t.startsWith("<")) return t;
  const escaped = t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<p>${escaped.replace(/\n/g, "<br/>")}</p>`;
};

const UNIT_VALUES = ["minute", "hour", "day", "week"];

const unitLabel = (unit, amount) => {
  const plural = amount !== 1;
  const map = {
    minute: plural ? "Minutes" : "Minute",
    hour: plural ? "Hours" : "Hour",
    day: plural ? "Days" : "Day",
    week: plural ? "Weeks" : "Week",
  };
  return map[unit];
};

const timingSelectStyle = {
  border: "1px solid #CBD5E0",
  borderRadius: "6px",
  background: "white",
  fontSize: "14px",
  height: "44px",
  paddingLeft: "12px",
  paddingRight: "32px",
  color: "#1A202C",
  minWidth: "140px",
  flex: "1",
  cursor: "pointer",
};

const numberInputStyle = {
  border: "1px solid #CBD5E0",
  borderRadius: "6px",
  background: "white",
  fontSize: "14px",
  height: "44px",
  width: "72px",
  paddingLeft: "10px",
  paddingRight: "8px",
  color: "#1A202C",
  textAlign: "center",
};

const templatePlaceholderInner = {
  fontSize: "14px",
  height: "44px",
  paddingLeft: "12px",
  paddingRight: "12px",
  color: "#718096",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  boxSizing: "border-box",
};

export const CreateEmailNotification = () => {
  const { eventId, notificationId } = useParams();
  const isEditing = Boolean(notificationId);
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState("minute");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT);
  const [bodyHtml, setBodyHtml] = useState("<p></p>");

  useEffect(() => {
    if (!isEditing || !eventId || !notificationId) return;
    const record = getEventEmailNotificationById(eventId, notificationId);
    if (!record) {
      navigate(`/events/${eventId}/edit/email`, { replace: true });
      return;
    }
    const n = record.amount;
    setAmount(typeof n === "number" && Number.isFinite(n) && n >= 1 ? n : 1);
    const u = record.unit;
    setUnit(typeof u === "string" && UNIT_VALUES.includes(u) ? u : "minute");
    if (record.templateId != null && record.templateName) {
      setSelectedTemplate({ id: record.templateId, name: record.templateName });
    }
    if (typeof record.emailSubject === "string" && record.emailSubject.trim() !== "") {
      setEmailSubject(record.emailSubject);
    } else {
      setEmailSubject(DEFAULT_EMAIL_SUBJECT);
    }
    if (typeof record.bodyHtml === "string" && record.bodyHtml.trim() !== "") {
      setBodyHtml(record.bodyHtml);
    } else {
      setBodyHtml("<p></p>");
    }
  }, [isEditing, eventId, notificationId, navigate]);

  const handleTemplateConfirm = useCallback(
    async (sel) => {
      try {
        const { data } = await backend.get(`/email-templates/${sel.id}`);
        const raw = data.templateText ?? data.template_text ?? "";
        const subj = data.subject != null ? String(data.subject).trim() : "";
        setSelectedTemplate(sel);
        setEmailSubject(subj || DEFAULT_EMAIL_SUBJECT);
        setBodyHtml(toEditorHtml(raw));
      } catch (err) {
        console.error("Failed to load email template:", err);
        setSelectedTemplate(sel);
        setEmailSubject(DEFAULT_EMAIL_SUBJECT);
        setBodyHtml("<p></p>");
      }
    },
    [backend]
  );

  const unitOptions = useMemo(
    () =>
      UNIT_VALUES.map((value) => ({
        value,
        label: unitLabel(value, amount),
      })),
    [amount]
  );

  const onAmountChange = (raw) => {
    if (raw === "") return;
    const n = Number.parseInt(raw, 10);
    if (Number.isNaN(n)) return;
    setAmount(Math.min(9999, Math.max(1, n)));
  };

  return (
    <VStack
      w="100%"
      minH="100vh"
      bg="#F7F8FA"
      align="start"
      px={10}
      pt={10}
      pb={10}
      gap={8}
    >
      <HStack
        fontSize="lg"
        gap={1}
        flexWrap="wrap"
      >
        <Text
          fontWeight="semibold"
          color="gray.700"
          cursor="pointer"
          onClick={() => navigate("/events")}
        >
          Event Catalog
        </Text>
        <Text color="gray.400">›</Text>
        <Text
          color="black"
          cursor="pointer"
          fontWeight="semibold"
          onClick={() => navigate(`/events/${eventId}`)}
        >
          View Event
        </Text>
        <Text color="gray.400">›</Text>
        <Text
          color="blue.500"
          fontWeight="semibold"
        >
          {isEditing ? "Edit Email Notification" : "Create Email Notification"}
        </Text>
      </HStack>

      <Text
        fontSize="4xl"
        fontWeight="semibold"
        color="gray.800"
      >
        {isEditing ? "Edit Email Notification" : "Create New Email Notification"}
      </Text>

      <Box
        w="100%"
        bg="white"
        border="1px solid #E2E8F0"
        borderRadius="lg"
        p={8}
      >
        <Box maxW="900px" w="100%">
        <Flex
          gap={{ base: 8, md: 12 }}
          align="flex-end"
          flexWrap="wrap"
          w="100%"
        >
          <VStack
            align="start"
            gap={2}
            flex="1 1 0"
            minW={{ base: "100%", md: "0" }}
          >
            <HStack gap={1}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
              >
                Timing
              </Text>
              <Text
                as="span"
                color="red.500"
                fontSize="sm"
                fontWeight="bold"
              >
                *
              </Text>
            </HStack>
            <HStack
              gap={2}
              align="stretch"
              w="100%"
            >
              <Input
                type="number"
                min={1}
                step={1}
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                onBlur={() => setAmount((a) => (Number.isFinite(a) && a >= 1 ? a : 1))}
                style={numberInputStyle}
                aria-label="Timing amount"
              />
              <NativeSelect.Root size="md" flex="1" minW="140px">
                <NativeSelect.Field
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={timingSelectStyle}
                  aria-label="Timing unit"
                >
                  {unitOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                    >
                      {opt.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </HStack>
          </VStack>

          <VStack
            align="start"
            gap={2}
            flex="1 1 0"
            minW={{ base: "100%", md: "0" }}
          >
            <HStack gap={1}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
              >
                Email Template
              </Text>
              <Text
                as="span"
                color="red.500"
                fontSize="sm"
                fontWeight="bold"
              >
                *
              </Text>
            </HStack>
            <Box
              w="100%"
              rounded="l2"
              borderWidth="1px"
              borderColor="gray.300"
              bg="white"
              style={templatePlaceholderInner}
              role="button"
              tabIndex={0}
              cursor="pointer"
              onClick={() => setTemplateModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setTemplateModalOpen(true);
                }
              }}
            >
              <Text
                fontSize="sm"
                color={selectedTemplate ? "gray.900" : "#718096"}
              >
                {selectedTemplate?.name ?? "Click to select"}
              </Text>
              <ChevronRight size={18} color="#A0AEC0" aria-hidden />
            </Box>
          </VStack>
        </Flex>
        </Box>

        {selectedTemplate ? (
          <VStack
            align="stretch"
            gap={6}
            mt={8}
            w="100%"
          >
            <VStack
              align="start"
              gap={2}
              w="100%"
            >
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="gray.700"
              >
                Email Subject Line
              </Text>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                borderColor="gray.300"
                rounded="l2"
                h="44px"
                fontSize="sm"
                placeholder={DEFAULT_EMAIL_SUBJECT}
              />
            </VStack>

            <EmailNotificationRichBody
              key={`${notificationId ?? "new"}-${selectedTemplate.id}`}
              initialHtml={bodyHtml}
              onHtmlChange={setBodyHtml}
            />
          </VStack>
        ) : null}

        <HStack
          w="100%"
          justify="flex-end"
          gap={3}
          mt={selectedTemplate ? 6 : 8}
          pt={selectedTemplate ? 2 : 0}
        >
          <Button
            variant="outline"
            borderRadius="md"
            px={6}
            fontSize="sm"
            border="1px solid #CBD5E0"
            color="gray.600"
            onClick={() =>
              navigate(
                isEditing ? `/events/${eventId}/edit/email` : `/events/${eventId}`
              )
            }
          >
            Cancel
          </Button>
          <Button
            bg="#487C9E"
            color="white"
            borderRadius="md"
            px={6}
            fontSize="sm"
            _hover={selectedTemplate ? { bg: "#3a6685" } : {}}
            type="button"
            disabled={!selectedTemplate}
            opacity={selectedTemplate ? 1 : 0.5}
            cursor={selectedTemplate ? "pointer" : "not-allowed"}
            onClick={() => {
              if (!eventId || !selectedTemplate) return;
              const snapshot = {
                sendTimingLabel: buildSendTimingLabel(amount, unit),
                templateName: selectedTemplate.name,
                templateId: selectedTemplate.id,
                amount,
                unit,
                emailSubject,
                bodyHtml,
              };
              if (isEditing && notificationId) {
                updateEventEmailNotification(eventId, notificationId, snapshot);
              } else {
                addEventEmailNotification(eventId, snapshot);
              }
              notifyEventEmailNotificationsChanged(eventId);
              navigate(`/events/${eventId}/edit/email`);
            }}
          >
            Save
          </Button>
        </HStack>
      </Box>

      <ChooseEmailTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        initialSelection={selectedTemplate}
        onConfirm={handleTemplateConfirm}
      />
    </VStack>
  );
};
