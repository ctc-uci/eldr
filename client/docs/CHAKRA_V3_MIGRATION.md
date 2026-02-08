# Chakra UI v2 → v3 Migration

This doc summarizes what was done and what remains for the ELDR client.

## Done

1. **Dependencies** (`client/package.json`)
   - Removed: `@chakra-ui/icons`, `@emotion/styled`, `framer-motion`
   - Updated: `@chakra-ui/react` to `^3.0.0`

2. **Provider & theme**
   - `src/components/ui/provider.tsx` – wraps app with `ChakraProvider` and `defaultSystem`
   - No custom theme file; using `defaultSystem` from `@chakra-ui/react`

3. **Toasts**
   - `src/components/ui/toaster.tsx` – `createToaster` + `Toaster` with default composition
   - Replaced `useToast()` with `toaster.create({ title, description, type })` in:
     - `RoleSelect.tsx`, `Login.tsx`, `Signup.tsx`, `AuthContext.tsx`
   - `type` is used instead of `status` ("success" | "error" | "warning" | "info")

4. **Entry & admin login**
   - `main.tsx` – uses `<Provider>` and `<Toaster />`
   - `adminLogin.tsx` – removed nested `ChakraProvider`; `Divider` → `Separator`; `variant="link"` → `variant="plain"`

5. **Forms**
   - `FormControl` → `Field.Root`, `FormErrorMessage` → `Field.ErrorText`, `FormHelperText` → `Field.HelperText`
   - `isInvalid` → `invalid`, `isRequired` → `required`, `isDisabled` → `disabled`

6. **Dashboard**
   - `Table` → `Table.Root`, `TableContainer` → `Table.ScrollArea`, `Thead` → `Table.Header`, `Tr` → `Table.Row`, `Th` → `Table.ColumnHeader`, `Tbody` → `Table.Body`, `Td` → `Table.Cell`
   - `spacing` → `gap` on Stack/VStack
   - `ChakraLink as={Link} to="..."` → `ChakraLink asChild><Link to="...">...</Link></ChakraLink>`

7. **RoleSelect**
   - `Select` → `NativeSelect.Root` + `NativeSelect.Field` + `NativeSelect.Indicator`
   - Toast calls updated to `toaster.create`

8. **Links**
   - For React Router: use `<ChakraLink asChild><Link to="...">...</Link></ChakraLink>` (v3 uses `asChild` instead of `as` for composition).

---

## Remaining (manual or codemod)

Run the official codemod from the **client** folder (you’ll be prompted twice; answer **Yes** both times):

```bash
cd client
npx @chakra-ui/codemod upgrade
```

Then apply these patterns anywhere the codemod doesn’t:

### Prop renames (search & replace)

- `spacing` → `gap` (Stack, VStack, HStack, SimpleGrid)
- `Divider` → `Separator` (and update imports)
- `isReadOnly` → `readOnly`
- `isAttached` → `attached` (ButtonGroup)
- `variant="link"` → `variant="plain"`
- `variant="unstyled"` → use the `unstyled` boolean prop where applicable

### IconButton

- `icon={<Icon />}` → put the icon as **children**: `<IconButton ...><Icon /></IconButton>`

### FormControl / FormLabel

- `FormControl` → `Field.Root`
- `FormLabel` → `Field.Label`
- `isInvalid` → `invalid`, etc.

### Table (if not already migrated)

- `Table` → `Table.Root`
- `TableContainer` → `Table.ScrollArea`
- `Thead` → `Table.Header`, `Tr` → `Table.Row`, `Th` → `Table.ColumnHeader`
- `Tbody` → `Table.Body`, `Td` → `Table.Cell`
- `Th isNumeric` → `Table.ColumnHeader textAlign="end"`

### Tabs

- `Tabs` → `Tabs.Root`
- `TabList` → `Tabs.List`
- `Tab` → `Tabs.Trigger` with **value** prop (e.g. `value="one"`)
- `TabPanels` → use `Tabs.Content` per panel with **value** matching the trigger

### Select → NativeSelect

- `<Select placeholder="..."><option>...</option></Select>` →
  - `<NativeSelect.Root><NativeSelect.Field placeholder="..."><option>...</option></NativeSelect.Field><NativeSelect.Indicator /></NativeSelect.Root>`

### Modal → Dialog

- `Modal` → `Dialog.Root` (with `open` / `onOpenChange`)
- `ModalOverlay` → `Dialog.Backdrop` inside `Portal`
- `ModalContent` → `Dialog.Positioner` + `Dialog.Content`
- `ModalHeader` → `Dialog.Header`, `ModalBody` → `Dialog.Body`, `ModalFooter` → `Dialog.Footer`, `ModalCloseButton` → `Dialog.CloseTrigger`

### Menu

- `Menu` → `Menu.Root`
- `MenuButton` → `Menu.Trigger asChild` (wrap your button)
- `MenuList` → `Portal` + `Menu.Positioner` + `Menu.Content`
- `MenuItem` → `Menu.Item` with `value` prop

### Tag

- `Tag` → `Tag.Root`
- `TagLabel` → `Tag.Label`
- `TagCloseButton` → `Tag.CloseTrigger`

### Progress

- `<Progress value={n} />` → `<Progress.Root value={n}><Progress.Track><Progress.Range /></Progress.Track></Progress.Root>`

### Icons

- Remove `@chakra-ui/icons`; use `react-icons` (e.g. `LuChevronDown`, `LuSearch`, `HiMail` from `react-icons/lu` or `react-icons/hi`) and wrap with Chakra `Icon` when you need Chakra style props.

---

## Reference

- [Chakra v3 migration guide](https://chakra-ui.com/docs/get-started/migration)
- Codemod: `npx @chakra-ui/codemod upgrade` (run from `client`, accept prompts)
