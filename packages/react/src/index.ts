/**
 * @license
 * Copyright (c) 2025-present Relteco LLC. All rights reserved.
 *
 * This source code is licensed under the BSL 1.1 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @relteco/relui-react
 *
 * React bindings and styled props-based components for RelUI.
 * Core state machine'leri üzerinde React hook'ları ve styled bileşenler.
 *
 * @packageDocumentation
 */

export const RELUI_REACT_VERSION = '0.1.0';

// ── Slot Utilities ──────────────────────────────────────
export {
  getSlotProps,
  type ClassNames,
  type Styles,
  type SlotStyleProps,
} from './utils';

// ── Sprinkles (Responsive Layout) ──────────────────────
export { sprinkles, type Sprinkles } from './utils';

// ── Box ────────────────────────────────────────────────
export { Box, type BoxProps, type BoxSlot } from './box';

// ── Button ──────────────────────────────────────────
export { Button, type ButtonProps, type ButtonSlot } from './button';
export { useButton, type UseButtonProps, type UseButtonReturn } from './button';

// ── IconButton ───────────────────────────────────────
export { IconButton, type IconButtonComponentProps, type IconButtonSlot } from './icon-button';

// ── ButtonGroup ──────────────────────────────────────
export { ButtonGroup, type ButtonGroupComponentProps, type ButtonGroupSlot } from './button-group';
export { useButtonGroupContext } from './button-group';

// ── CopyButton ──────────────────────────────────────
export { CopyButton, type CopyButtonComponentProps, type CopyButtonSlot } from './copy-button';
export { useCopyButton, type UseCopyButtonProps, type UseCopyButtonReturn } from './copy-button';

// ── Input ────────────────────────────────────────────
export { Input, type InputComponentProps, type InputSlot } from './input';
export { useInput, type UseInputProps, type UseInputReturn } from './input';

// ── Textarea ─────────────────────────────────────────
export { Textarea, type TextareaComponentProps, type TextareaSlot } from './textarea';
export { useTextarea, type UseTextareaProps, type UseTextareaReturn } from './textarea';

// ── Checkbox ─────────────────────────────────────────
export { Checkbox, type CheckboxComponentProps, type CheckboxSlot } from './checkbox';
export { useCheckbox, type UseCheckboxProps, type UseCheckboxReturn } from './checkbox';

// ── Radio ────────────────────────────────────────────
export { Radio, type RadioComponentProps, type RadioSlot } from './radio';
export { useRadio, type UseRadioProps, type UseRadioReturn } from './radio';

// ── RadioGroup ───────────────────────────────────────
export { RadioGroup, type RadioGroupComponentProps, type RadioGroupSlot } from './radio-group';
export { useRadioGroupContext } from './radio-group';

// ── Switch ──────────────────────────────────────────
export { Switch, type SwitchComponentProps, type SwitchSlot } from './switch';
export { useSwitch, type UseSwitchProps, type UseSwitchReturn } from './switch';

// ── Slider ──────────────────────────────────────────
export { Slider, type SliderComponentProps, type SliderSlot } from './slider';
export { useSlider, type UseSliderProps, type UseSliderReturn } from './slider';

// ── RangeSlider ────────────────────────────────────
export { RangeSlider, type RangeSliderComponentProps, type RangeSliderSlot } from './range-slider';
export { useRangeSlider, type UseRangeSliderProps, type UseRangeSliderReturn } from './range-slider';

// ── Label ──────────────────────────────────────────
export { Label, type LabelComponentProps, type LabelSlot } from './label';

// ── FormField ──────────────────────────────────────
export { FormField, type FormFieldComponentProps, type FormFieldSlot } from './form-field';
export { useFormFieldContext } from './form-field';

// ── FormGroup ──────────────────────────────────────
export { FormGroup, type FormGroupComponentProps, type FormGroupSlot } from './form-group';

// ── Badge ──────────────────────────────────────────
export { Badge, type BadgeComponentProps, type BadgeSlot } from './badge';

// ── Tag ────────────────────────────────────────────
export { Tag, type TagComponentProps, type TagSlot } from './tag';

// ── Chip ───────────────────────────────────────────
export { Chip, type ChipComponentProps, type ChipSlot } from './chip';

// ── NumberInput ─────────────────────────────────────
export { NumberInput, type NumberInputComponentProps, type NumberInputSlot } from './number-input';
export { useNumberInput, type UseNumberInputProps, type UseNumberInputReturn } from './number-input';

// ── PasswordInput ────────────────────────────────────
export { PasswordInput, type PasswordInputComponentProps, type PasswordInputSlot } from './password-input';
export { usePasswordInput, type UsePasswordInputProps, type UsePasswordInputReturn } from './password-input';

// ── CurrencyInput ────────────────────────────────────
export { CurrencyInput, type CurrencyInputComponentProps, type CurrencyInputSlot } from './currency-input';
export { useCurrencyInput, type UseCurrencyInputProps, type UseCurrencyInputReturn } from './currency-input';

// ── MaskedInput ─────────────────────────────────────
export { MaskedInput, type MaskedInputComponentProps, type MaskedInputSlot } from './masked-input';
export { useMaskedInput, type UseMaskedInputProps, type UseMaskedInputReturn } from './masked-input';

// ── Select ──────────────────────────────────────────
export { Select, type SelectComponentProps, type SelectSlot } from './select';
export { useSelect, type UseSelectProps, type UseSelectReturn } from './select';

// ── MultiSelect ─────────────────────────────────────
export { MultiSelect, type MultiSelectComponentProps, type MultiSelectSlot } from './multi-select';
export { useMultiSelect, type UseMultiSelectProps, type UseMultiSelectReturn } from './multi-select';

// ── Combobox ────────────────────────────────────────
export { Combobox, type ComboboxComponentProps, type ComboboxSlot } from './combobox';
export { useCombobox, type UseComboboxProps, type UseComboboxReturn } from './combobox';

// ── SegmentedControl ────────────────────────────────
export { SegmentedControl, type SegmentedControlComponentProps, type SegmentedControlSlot } from './segmented-control';
export { useSegmentedControl, type UseSegmentedControlProps, type UseSegmentedControlReturn } from './segmented-control';

// ── InPlaceEditor ───────────────────────────────────
export { InPlaceEditor, type InPlaceEditorComponentProps, type InPlaceEditorSlot } from './in-place-editor';
export { useInPlaceEditor, type UseInPlaceEditorProps, type UseInPlaceEditorReturn } from './in-place-editor';

// ── TagInput ────────────────────────────────────────
export { TagInput, type TagInputComponentProps, type TagInputSlot } from './tag-input';
export { useTagInput, type UseTagInputProps, type UseTagInputReturn } from './tag-input';

// ── Cascader ────────────────────────────────────────
export { Cascader, type CascaderComponentProps, type CascaderSlot } from './cascader';
export { useCascader, type UseCascaderProps, type UseCascaderReturn } from './cascader';

// ── MultiColumnCombobox ────────────────────────────
export { MultiColumnCombobox, type MultiColumnComboboxComponentProps, type MultiColumnComboboxSlot } from './multi-column-combobox';
export { useMultiColumnCombobox, type UseMultiColumnComboboxProps, type UseMultiColumnComboboxReturn } from './multi-column-combobox';

// ── DropdownTree ───────────────────────────────────
export { DropdownTree, type DropdownTreeComponentProps, type DropdownTreeSlot } from './dropdown-tree';
export { useDropdownTree, type UseDropdownTreeProps, type UseDropdownTreeReturn } from './dropdown-tree';

// ── Layout: Flex ──────────────────────────────────
export { Flex, type FlexProps, type FlexSlot } from './flex';

// ── Layout: Stack ─────────────────────────────────
export { Stack, type StackProps, type StackSlot } from './stack';

// ── Layout: Grid ──────────────────────────────────
export { Grid, type GridProps, type GridSlot } from './grid';

// ── Layout: Container ─────────────────────────────
export { Container, type ContainerProps, type ContainerSlot, type ContainerSize } from './container';

// ── Layout: Divider ───────────────────────────────
export { Divider, type DividerProps, type DividerSlot } from './divider';

// ── Layout: Spacer ────────────────────────────────
export { Spacer, type SpacerProps, type SpacerSlot } from './spacer';

// ── Layout: AspectRatio ───────────────────────────
export { AspectRatio, type AspectRatioProps, type AspectRatioSlot } from './aspect-ratio';

// ── Layout: Section ──────────────────────────────
export { Section, type SectionProps, type SectionSlot } from './section';

// ── Layout: ScrollArea ─────────────────────────────
export { ScrollArea, type ScrollAreaComponentProps, type ScrollAreaSlot } from './scroll-area';
export { useScrollArea, type UseScrollAreaProps, type UseScrollAreaReturn } from './scroll-area';

// ── Layout: Sticky ─────────────────────────────────
export { Sticky, type StickyComponentProps, type StickySlot } from './sticky';
export { useSticky, type UseStickyProps, type UseStickyReturn } from './sticky';

// ── Layout: Resizable ──────────────────────────────
export { Resizable, type ResizableComponentProps, type ResizableSlot } from './resizable';
export { useResizable, type UseResizableProps, type UseResizableReturn } from './resizable';

// ── Layout: ResponsiveBox ─────────────────────────
export { ResponsiveBox, type ResponsiveBoxProps, type ResponsiveBoxSlot, type ResponsiveRule } from './responsive-box';

// ── Layout: Masonry ───────────────────────────────
export { Masonry, type MasonryComponentProps, type MasonrySlot } from './masonry';

// ── Layout: MasterDetailLayout ────────────────────
export { MasterDetailLayout, type MasterDetailComponentProps, type MasterDetailSlot } from './master-detail';

// ── Window Manager: SplitPanel ────────────────────
export { SplitPanel, type SplitPanelComponentProps, type SplitPanelSlot } from './split-panel';

// ── Window Manager: FloatingWindow ────────────────
export { FloatingWindow, type FloatingWindowComponentProps, type FloatingWindowSlot } from './floating-window';

// ── Window Manager: TileLayout ──────────────────
export { TileLayout, type TileLayoutComponentProps, type TileLayoutSlot } from './tile-layout';

// ── Window Manager: BookLayout ──────────────────
export { BookLayout, type BookLayoutComponentProps, type BookLayoutSlot } from './book-layout';

// ── Window Manager: DockLayout ──────────────────
export { DockLayout, type DockLayoutComponentProps, type DockLayoutSlot } from './dock-layout';

// ── Window Manager: MDI ─────────────────────────
export { MDI, type MDIComponentProps, type MDISlot } from './mdi';

// ── Navigation: Tabs ────────────────────────────
export { Tabs, type TabsComponentProps, type TabsSlot, type TabPanelContent } from './tabs';
export { useTabs, type UseTabsProps, type UseTabsReturn } from './tabs';

// ── Navigation: Breadcrumb ─────────────────────────
export { Breadcrumb, type BreadcrumbComponentProps, type BreadcrumbSlot } from './breadcrumb';
export { useBreadcrumb, type UseBreadcrumbProps, type UseBreadcrumbReturn } from './breadcrumb';

// ── Navigation: Pagination ─────────────────────────
export { Pagination, type PaginationComponentProps, type PaginationSlot } from './pagination';
export { usePagination, type UsePaginationProps, type UsePaginationReturn } from './pagination';

// ── Navigation: Sidebar ───────────────────────────
export { Sidebar, type SidebarComponentProps, type SidebarSlot } from './sidebar';
export { useSidebar, type UseSidebarProps, type UseSidebarReturn } from './sidebar';

// ── Navigation: Navbar ────────────────────────────
export { Navbar, type NavbarComponentProps, type NavbarSlot } from './navbar';
export { useNavbar, type UseNavbarProps, type UseNavbarReturn } from './navbar';

// ── Menu ────────────────────────────────────────────────
export { Menu, type MenuComponentProps, type MenuSlot } from './menu';
export { useMenu, type UseMenuProps, type UseMenuReturn } from './menu';

// ── RadialMenu ──────────────────────────────────────────────
export { RadialMenu, type RadialMenuComponentProps, type RadialMenuSlot } from './radial-menu';
export { useRadialMenu, type UseRadialMenuProps, type UseRadialMenuReturn } from './radial-menu';

// ── CommandPalette ──────────────────────────────────────────
export { CommandPalette, type CommandPaletteComponentProps, type CommandPaletteSlot } from './command-palette';
export { useCommandPalette, type UseCommandPaletteProps, type UseCommandPaletteReturn } from './command-palette';

// ── Spotlight ──────────────────────────────────────────────
export { Spotlight, type SpotlightComponentProps, type SpotlightSlot } from './spotlight';
export { useSpotlight, type UseSpotlightProps, type UseSpotlightReturn } from './spotlight';

// ── Link / NavLink ─────────────────────────────────────────
export { Link, type LinkComponentProps, type LinkSlot, type LinkSize, type LinkVariant, type LinkUnderline } from './link';
export { NavLink, type NavLinkComponentProps, type NavLinkSlot } from './link';

// ── BackToTop ──────────────────────────────────────────────
export { BackToTop, type BackToTopComponentProps, type BackToTopSlot, type BackToTopSize, type BackToTopVariant, type BackToTopShape } from './back-to-top';

// ── TableOfContents ──────────────────────────────────────────
export { TableOfContents, type TableOfContentsComponentProps, type TableOfContentsSlot, type TableOfContentsSize, type TableOfContentsVariant } from './table-of-contents';
export { useTableOfContents, type UseTableOfContentsProps, type UseTableOfContentsReturn } from './table-of-contents';

// ── FAB (FloatingActionButton) ──────────────────────────────
export { FAB, type FABComponentProps, type FABSlot, type FABSize, type FABVariant } from './fab';
export { useFAB, type UseFABProps, type UseFABReturn } from './fab';

// ── Alert ──────────────────────────────────────────────────
export { Alert, type AlertComponentProps, type AlertSlot } from './alert';

// ── Spinner ────────────────────────────────────────────────
export { Spinner, type SpinnerComponentProps, type SpinnerSlot, type SpinnerSize } from './spinner';

// ── Progress ──────────────────────────────────────────────
export { Progress, type ProgressComponentProps, type ProgressSlot, type ProgressType } from './progress';

// ── Skeleton ──────────────────────────────────────────────
export { Skeleton, type SkeletonComponentProps, type SkeletonSlot, type SkeletonVariant, type SkeletonAnimation } from './skeleton';

// ── EmptyState ────────────────────────────────────────────
export { EmptyState, type EmptyStateComponentProps, type EmptyStateSlot, type EmptyStateSize } from './empty-state';

// ── Result ────────────────────────────────────────────────
export { Result, type ResultComponentProps, type ResultSlot, type ResultStatus, type ResultSize } from './result';

// ── LoadPanel ──────────────────────────────────────────────
export { LoadPanel, type LoadPanelComponentProps, type LoadPanelSlot, type LoadPanelSize, type LoadPanelBackdrop } from './load-panel';

// ── Toast ──────────────────────────────────────────────────
export { Toast, type ToastComponentProps, type ToastSlot } from './toast';
export { useToast, type UseToastProps, type UseToastReturn } from './toast';

// ── AlertDialog ────────────────────────────────────────────
export { AlertDialog, type AlertDialogComponentProps, type AlertDialogSlot } from './alert-dialog';

// ── NotificationCenter ─────────────────────────────────────
export { NotificationCenter, type NotificationCenterComponentProps, type NotificationCenterSlot } from './notification-center';
export { useNotificationCenter, type UseNotificationCenterProps, type UseNotificationCenterReturn } from './notification-center';

// ── Tour ─────────────────────────────────────────────────
export { Tour, type TourComponentProps, type TourSlot } from './tour';

// ── SplashScreen ─────────────────────────────────────────
export { SplashScreen, type SplashScreenComponentProps, type SplashScreenSlot } from './splash-screen';

// ── ValidationSummary ────────────────────────────────────
export { ValidationSummary, type ValidationSummaryComponentProps, type ValidationSummarySlot } from './validation-summary';

// ── Modal ────────────────────────────────────────────────
export { Modal, type ModalComponentProps, type ModalSlot } from './modal';

// ── Drawer ───────────────────────────────────────────────
export { Drawer, type DrawerComponentProps, type DrawerSlot } from './drawer';

// ── Popover ─────────────────────────────────────────────
export { Popover, type PopoverComponentProps, type PopoverSlot } from './popover';

// ── Tooltip ─────────────────────────────────────────────
export { Tooltip, type TooltipComponentProps, type TooltipSlot } from './tooltip';

// ── ContextMenu ─────────────────────────────────────────
export { ContextMenu, type ContextMenuComponentProps, type ContextMenuSlot } from './context-menu';

// ── DropdownMenu ────────────────────────────────────────
export { DropdownMenu, type DropdownMenuComponentProps, type DropdownMenuSlot } from './dropdown-menu';

// ── Flyout ──────────────────────────────────────────────
export { Flyout, type FlyoutComponentProps, type FlyoutSlot } from './flyout';

// ── Accordion ───────────────────────────────────────────
export { Accordion, type AccordionComponentProps, type AccordionSlot, type AccordionItemDef } from './accordion';

// ── Card ────────────────────────────────────────────────
export { Card, type CardComponentProps, type CardSlot, type CardVariant, type CardMedia } from './card';

// ── List ────────────────────────────────────────────────
export { List, type ListComponentProps, type ListSlot, type ListItemDef, type ListItemComponentProps } from './list';

// ── Avatar ──────────────────────────────────────────────
export { Avatar, getInitials, getColorFromName, type AvatarComponentProps, type AvatarSlot, type AvatarSize, type AvatarVariant, type AvatarImageProps, type AvatarFallbackProps } from './avatar';

// ── AvatarGroup ─────────────────────────────────────────
export { AvatarGroup, type AvatarGroupComponentProps, type AvatarGroupSlot, type AvatarDef, type AvatarGroupAvatarProps } from './avatar-group';

// ── Typography ──────────────────────────────────────────
export { Typography, type TypographyComponentProps, type TypographySlot, type TypographyVariant, type TypographyAlign, type TypographyHeadingProps, type TypographyTextProps } from './typography';

// ── Blockquote ──────────────────────────────────────────
export { Blockquote, type BlockquoteComponentProps, type BlockquoteSlot, type BlockquoteVariant, type BlockquoteContentProps, type BlockquoteCiteProps } from './blockquote';

// ── DescriptionList ─────────────────────────────────────
export { DescriptionList, type DescriptionListComponentProps, type DescriptionListSlot, type DescriptionListDirection, type DescriptionListSize, type DescriptionItemDef, type DescriptionListItemProps } from './description-list';

// ── Timeline ────────────────────────────────────────────
export { Timeline, type TimelineComponentProps, type TimelineSlot, type TimelineOrientation, type TimelineAlign, type TimelineItemDef, type TimelineItemProps } from './timeline';

// ── Stat ────────────────────────────────────────────────
export { Stat, type StatComponentProps, type StatSlot, type StatSize, type StatTrend, type StatValueProps, type StatLabelProps, type StatHelpTextProps, type StatIconProps, type StatTrendProps } from './stat';

// ── StatGroup ───────────────────────────────────────────
export { StatGroup, type StatGroupComponentProps, type StatGroupSlot, type StatGroupDirection, type StatDef, type StatGroupStatProps } from './stat-group';
