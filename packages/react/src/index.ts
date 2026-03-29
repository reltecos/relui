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
export { Button, type ButtonProps, type ButtonSlot, type ButtonLeftIconProps, type ButtonRightIconProps } from './button';
export { useButton, type UseButtonProps, type UseButtonReturn } from './button';

// ── IconButton ───────────────────────────────────────
export { IconButton, type IconButtonComponentProps, type IconButtonSlot, type IconButtonIconProps } from './icon-button';

// ── ButtonGroup ──────────────────────────────────────
export { ButtonGroup, type ButtonGroupComponentProps, type ButtonGroupSlot } from './button-group';
export { useButtonGroupContext } from './button-group';

// ── CopyButton ──────────────────────────────────────
export { CopyButton, useCopyButtonContext, type CopyButtonComponentProps, type CopyButtonSlot, type CopyButtonIconProps, type CopyButtonLabelProps } from './copy-button';
export { useCopyButton, type UseCopyButtonProps, type UseCopyButtonReturn } from './copy-button';

// ── Input ────────────────────────────────────────────
export { Input, useInputContext, type InputComponentProps, type InputSlot, type InputLeftAddonProps, type InputRightAddonProps } from './input';
export { useInput, type UseInputProps, type UseInputReturn } from './input';

// ── Textarea ─────────────────────────────────────────
export { Textarea, useTextareaContext, type TextareaComponentProps, type TextareaSlot, type TextareaLabelProps, type TextareaCounterProps } from './textarea';
export { useTextarea, type UseTextareaProps, type UseTextareaReturn } from './textarea';

// ── Checkbox ─────────────────────────────────────────
export { Checkbox, type CheckboxComponentProps, type CheckboxSlot, type CheckboxIndicatorProps, type CheckboxLabelProps } from './checkbox';
export { useCheckbox, type UseCheckboxProps, type UseCheckboxReturn } from './checkbox';

// ── Radio ────────────────────────────────────────────
export { Radio, type RadioComponentProps, type RadioSlot, type RadioIndicatorProps, type RadioLabelProps } from './radio';
export { useRadio, type UseRadioProps, type UseRadioReturn } from './radio';

// ── RadioGroup ───────────────────────────────────────
export { RadioGroup, type RadioGroupComponentProps, type RadioGroupSlot } from './radio-group';
export { useRadioGroupContext } from './radio-group';

// ── Switch ──────────────────────────────────────────
export { Switch, type SwitchComponentProps, type SwitchSlot, type SwitchTrackProps, type SwitchThumbProps, type SwitchLabelProps } from './switch';
export { useSwitch, type UseSwitchProps, type UseSwitchReturn } from './switch';

// ── Slider ──────────────────────────────────────────
export { Slider, type SliderComponentProps, type SliderSlot, type SliderTrackProps, type SliderThumbProps, type SliderLabelProps } from './slider';
export { useSlider, type UseSliderProps, type UseSliderReturn } from './slider';

// ── RangeSlider ────────────────────────────────────
export { RangeSlider, useRangeSliderContext, type RangeSliderComponentProps, type RangeSliderSlot, type RangeSliderTrackProps, type RangeSliderThumbProps } from './range-slider';
export { useRangeSlider, type UseRangeSliderProps, type UseRangeSliderReturn } from './range-slider';

// ── Label ──────────────────────────────────────────
export { Label, type LabelComponentProps, type LabelSlot, type LabelTextProps, type LabelRequiredIndicatorProps } from './label';

// ── FormField ──────────────────────────────────────
export { FormField, type FormFieldComponentProps, type FormFieldSlot } from './form-field';
export { useFormFieldContext } from './form-field';

// ── FormGroup ──────────────────────────────────────
export { FormGroup, type FormGroupComponentProps, type FormGroupSlot, type FormGroupLegendProps, type FormGroupContentProps } from './form-group';

// ── Badge ──────────────────────────────────────────
export { Badge, type BadgeComponentProps, type BadgeSlot, type BadgeIconProps } from './badge';

// ── Tag ────────────────────────────────────────────
export { Tag, type TagComponentProps, type TagSlot, type TagIconProps, type TagRemoveButtonProps } from './tag';

// ── Chip ───────────────────────────────────────────
export { Chip, type ChipComponentProps, type ChipSlot, type ChipIconProps, type ChipRemoveButtonProps } from './chip';

// ── NumberInput ─────────────────────────────────────
export { NumberInput, useNumberInputContext, type NumberInputComponentProps, type NumberInputSlot, type NumberInputFieldProps, type NumberInputIncrementButtonProps, type NumberInputDecrementButtonProps } from './number-input';
export { useNumberInput, type UseNumberInputProps, type UseNumberInputReturn } from './number-input';

// ── PasswordInput ────────────────────────────────────
export { PasswordInput, usePasswordInputContext, type PasswordInputComponentProps, type PasswordInputSlot, type PasswordInputToggleButtonProps } from './password-input';
export { usePasswordInput, type UsePasswordInputProps, type UsePasswordInputReturn } from './password-input';

// ── CurrencyInput ────────────────────────────────────
export { CurrencyInput, useCurrencyInputContext, type CurrencyInputComponentProps, type CurrencyInputSlot, type CurrencyInputSymbolProps, type CurrencyInputFieldProps } from './currency-input';
export { useCurrencyInput, type UseCurrencyInputProps, type UseCurrencyInputReturn } from './currency-input';

// ── MaskedInput ─────────────────────────────────────
export { MaskedInput, useMaskedInputContext, type MaskedInputComponentProps, type MaskedInputSlot, type MaskedInputFieldProps } from './masked-input';
export { useMaskedInput, type UseMaskedInputProps, type UseMaskedInputReturn } from './masked-input';

// ── Select ──────────────────────────────────────────
export { Select, type SelectComponentProps, type SelectSlot, type SelectTriggerProps, type SelectValueProps, type SelectContentProps, type SelectOptionProps, type SelectGroupProps } from './select';
export { useSelect, type UseSelectProps, type UseSelectReturn } from './select';

// ── MultiSelect ─────────────────────────────────────
export { MultiSelect, type MultiSelectComponentProps, type MultiSelectSlot, type MultiSelectTriggerProps, type MultiSelectValueProps, type MultiSelectContentProps, type MultiSelectOptionProps } from './multi-select';
export { useMultiSelect, type UseMultiSelectProps, type UseMultiSelectReturn } from './multi-select';

// ── Combobox ────────────────────────────────────────
export { Combobox, type ComboboxComponentProps, type ComboboxSlot, type ComboboxInputProps, type ComboboxContentProps, type ComboboxOptionProps, type ComboboxEmptyProps } from './combobox';
export { useCombobox, type UseComboboxProps, type UseComboboxReturn } from './combobox';

// ── SegmentedControl ────────────────────────────────
export { SegmentedControl, type SegmentedControlComponentProps, type SegmentedControlSlot, type SegmentedControlOptionProps } from './segmented-control';
export { useSegmentedControl, type UseSegmentedControlProps, type UseSegmentedControlReturn } from './segmented-control';

// ── InPlaceEditor ───────────────────────────────────
export { InPlaceEditor, type InPlaceEditorComponentProps, type InPlaceEditorSlot, type InPlaceEditorDisplayProps, type InPlaceEditorInputProps, type InPlaceEditorActionsProps } from './in-place-editor';
export { useInPlaceEditor, type UseInPlaceEditorProps, type UseInPlaceEditorReturn } from './in-place-editor';

// ── TagInput ────────────────────────────────────────
export { TagInput, type TagInputComponentProps, type TagInputSlot, type TagInputTagProps, type TagInputInputProps } from './tag-input';
export { useTagInput, type UseTagInputProps, type UseTagInputReturn } from './tag-input';

// ── Cascader ────────────────────────────────────────
export { Cascader, type CascaderComponentProps, type CascaderSlot, type CascaderTriggerProps, type CascaderPanelProps, type CascaderColumnProps } from './cascader';
export { useCascader, type UseCascaderProps, type UseCascaderReturn } from './cascader';

// ── MultiColumnCombobox ────────────────────────────
export { MultiColumnCombobox, type MultiColumnComboboxComponentProps, type MultiColumnComboboxSlot, type MultiColumnComboboxInputProps, type MultiColumnComboboxContentProps, type MultiColumnComboboxColumnProps } from './multi-column-combobox';
export { useMultiColumnCombobox, type UseMultiColumnComboboxProps, type UseMultiColumnComboboxReturn } from './multi-column-combobox';

// ── DropdownTree ───────────────────────────────────
export { DropdownTree, type DropdownTreeComponentProps, type DropdownTreeSlot, type DropdownTreeTriggerProps, type DropdownTreeContentProps, type DropdownTreeNodeProps } from './dropdown-tree';
export { useDropdownTree, type UseDropdownTreeProps, type UseDropdownTreeReturn } from './dropdown-tree';

// ── Layout: Flex ──────────────────────────────────
export { Flex, type FlexProps, type FlexSlot, type FlexItemProps } from './flex';

// ── Layout: Stack ─────────────────────────────────
export { Stack, type StackProps, type StackSlot, type StackItemProps } from './stack';

// ── Layout: Grid ──────────────────────────────────
export { Grid, type GridProps, type GridSlot, type GridItemProps } from './grid';

// ── Layout: Container ─────────────────────────────
export { Container, type ContainerProps, type ContainerSlot, type ContainerSize } from './container';

// ── Layout: Divider ───────────────────────────────
export { Divider, type DividerProps, type DividerSlot, type DividerLabelProps } from './divider';

// ── Layout: Spacer ────────────────────────────────
export { Spacer, type SpacerProps, type SpacerSlot } from './spacer';

// ── Layout: AspectRatio ───────────────────────────
export { AspectRatio, type AspectRatioProps, type AspectRatioSlot } from './aspect-ratio';

// ── Layout: Section ──────────────────────────────
export { Section, type SectionProps, type SectionSlot, type SectionHeaderProps, type SectionContentProps } from './section';

// ── Layout: ScrollArea ─────────────────────────────
export { ScrollArea, type ScrollAreaComponentProps, type ScrollAreaSlot, type ScrollAreaViewportProps, type ScrollAreaScrollbarProps } from './scroll-area';
export { useScrollArea, type UseScrollAreaProps, type UseScrollAreaReturn } from './scroll-area';

// ── Layout: Sticky ─────────────────────────────────
export { Sticky, useStickyContext, type StickyComponentProps, type StickySlot, type StickyContentProps } from './sticky';
export { useSticky, type UseStickyProps, type UseStickyReturn } from './sticky';

// ── Layout: Resizable ──────────────────────────────
export { Resizable, type ResizableComponentProps, type ResizableSlot, type ResizableHandleProps } from './resizable';
export { useResizable, type UseResizableProps, type UseResizableReturn } from './resizable';

// ── Layout: ResponsiveBox ─────────────────────────
export { ResponsiveBox, useResponsiveBoxContext, type ResponsiveBoxProps, type ResponsiveBoxSlot, type ResponsiveBoxItemProps, type ResponsiveRule } from './responsive-box';

// ── Layout: Masonry ───────────────────────────────
export { Masonry, type MasonryComponentProps, type MasonrySlot, type MasonryItemProps } from './masonry';

// ── Layout: MasterDetailLayout ────────────────────
export { MasterDetailLayout, useMasterDetailContext, type MasterDetailComponentProps, type MasterDetailSlot, type MasterDetailMasterProps, type MasterDetailDetailProps } from './master-detail';

// ── Window Manager: SplitPanel ────────────────────
export { SplitPanel, type SplitPanelComponentProps, type SplitPanelSlot, type SplitPanelPaneProps, type SplitPanelHandleProps } from './split-panel';

// ── Window Manager: FloatingWindow ────────────────
export { FloatingWindow, type FloatingWindowComponentProps, type FloatingWindowSlot, type FloatingWindowHeaderProps, type FloatingWindowBodyProps, type FloatingWindowCloseButtonProps } from './floating-window';

// ── Window Manager: TileLayout ──────────────────
export { TileLayout, type TileLayoutComponentProps, type TileLayoutSlot, type TileLayoutTileProps } from './tile-layout';

// ── Window Manager: BookLayout ──────────────────
export { BookLayout, type BookLayoutComponentProps, type BookLayoutSlot, type BookLayoutPageProps, type BookLayoutNavigationProps } from './book-layout';

// ── Window Manager: DockLayout ──────────────────
export { DockLayout, type DockLayoutComponentProps, type DockLayoutSlot } from './dock-layout';

// ── Window Manager: MDI ─────────────────────────
export { MDI, type MDIComponentProps, type MDISlot, type MDIWindowProps, type MDIToolbarProps } from './mdi';

// ── Navigation: Tabs ────────────────────────────
export { Tabs, type TabsComponentProps, type TabsSlot, type TabPanelContent, type TabsListProps, type TabsTabProps, type TabsPanelProps } from './tabs';
export { useTabs, type UseTabsProps, type UseTabsReturn } from './tabs';

// ── Navigation: Breadcrumb ─────────────────────────
export { Breadcrumb, type BreadcrumbComponentProps, type BreadcrumbSlot, type BreadcrumbItemCompoundProps, type BreadcrumbSeparatorProps, type BreadcrumbLinkProps } from './breadcrumb';
export { useBreadcrumb, type UseBreadcrumbProps, type UseBreadcrumbReturn } from './breadcrumb';

// ── Navigation: Pagination ─────────────────────────
export { Pagination, type PaginationComponentProps, type PaginationSlot, type PaginationPrevButtonProps, type PaginationNextButtonProps, type PaginationPageButtonProps } from './pagination';
export { usePagination, type UsePaginationProps, type UsePaginationReturn } from './pagination';

// ── Navigation: Sidebar ───────────────────────────
export { Sidebar, type SidebarComponentProps, type SidebarSlot, type SidebarHeaderProps, type SidebarSectionProps, type SidebarItemProps, type SidebarFooterProps } from './sidebar';
export { useSidebar, type UseSidebarProps, type UseSidebarReturn } from './sidebar';

// ── Navigation: Navbar ────────────────────────────
export { Navbar, type NavbarComponentProps, type NavbarSlot, type NavbarBrandProps, type NavbarItemsProps, type NavbarItemProps, type NavbarActionsProps } from './navbar';
export { useNavbar, type UseNavbarProps, type UseNavbarReturn } from './navbar';

// ── Menu ────────────────────────────────────────────────
export { Menu, type MenuComponentProps, type MenuSlot, type MenuItemComponentProps, type MenuGroupProps, type MenuSeparatorProps, type MenuLabelProps } from './menu';
export { useMenu, type UseMenuProps, type UseMenuReturn } from './menu';

// ── RadialMenu ──────────────────────────────────────────────
export { RadialMenu, type RadialMenuComponentProps, type RadialMenuSlot, type RadialMenuItemProps, type RadialMenuCenterProps } from './radial-menu';
export { useRadialMenu, type UseRadialMenuProps, type UseRadialMenuReturn } from './radial-menu';

// ── CommandPalette ──────────────────────────────────────────
export { CommandPalette, type CommandPaletteComponentProps, type CommandPaletteSlot, type CommandPaletteInputProps, type CommandPaletteListProps, type CommandPaletteItemComponentProps, type CommandPaletteGroupProps } from './command-palette';
export { useCommandPalette, type UseCommandPaletteProps, type UseCommandPaletteReturn } from './command-palette';

// ── Spotlight ──────────────────────────────────────────────
export { Spotlight, type SpotlightComponentProps, type SpotlightSlot, type SpotlightInputProps, type SpotlightListProps, type SpotlightItemComponentProps } from './spotlight';
export { useSpotlight, type UseSpotlightProps, type UseSpotlightReturn } from './spotlight';

// ── Link / NavLink ─────────────────────────────────────────
export { Link, type LinkComponentProps, type LinkSlot, type LinkSize, type LinkVariant, type LinkUnderline, type LinkIconProps } from './link';
export { NavLink, type NavLinkComponentProps, type NavLinkSlot } from './link';

// ── BackToTop ──────────────────────────────────────────────
export { BackToTop, type BackToTopComponentProps, type BackToTopSlot, type BackToTopSize, type BackToTopVariant, type BackToTopShape, type BackToTopIconProps } from './back-to-top';

// ── TableOfContents ──────────────────────────────────────────
export { TableOfContents, type TableOfContentsComponentProps, type TableOfContentsSlot, type TableOfContentsSize, type TableOfContentsVariant, type TableOfContentsItemProps, type TableOfContentsLinkProps } from './table-of-contents';
export { useTableOfContents, type UseTableOfContentsProps, type UseTableOfContentsReturn } from './table-of-contents';

// ── FAB (FloatingActionButton) ──────────────────────────────
export { FAB, type FABComponentProps, type FABSlot, type FABSize, type FABVariant, type FABIconProps, type FABLabelProps } from './fab';
export { useFAB, type UseFABProps, type UseFABReturn } from './fab';

// ── Alert ──────────────────────────────────────────────────
export { Alert, type AlertComponentProps, type AlertSlot, type AlertIconProps, type AlertTitleProps, type AlertDescriptionProps, type AlertCloseButtonProps } from './alert';

// ── Spinner ────────────────────────────────────────────────
export { Spinner, type SpinnerComponentProps, type SpinnerSlot, type SpinnerSize, type SpinnerLabelProps } from './spinner';

// ── Progress ──────────────────────────────────────────────
export { Progress, type ProgressComponentProps, type ProgressSlot, type ProgressType, type ProgressTrackProps, type ProgressFillProps, type ProgressLabelProps, type ProgressValueProps } from './progress';

// ── Skeleton ──────────────────────────────────────────────
export { Skeleton, type SkeletonComponentProps, type SkeletonSlot, type SkeletonVariant, type SkeletonAnimation, type SkeletonCircleProps, type SkeletonRectProps, type SkeletonTextProps } from './skeleton';

// ── EmptyState ────────────────────────────────────────────
export { EmptyState, type EmptyStateComponentProps, type EmptyStateSlot, type EmptyStateSize, type EmptyStateIconProps, type EmptyStateTitleProps, type EmptyStateDescriptionProps, type EmptyStateActionProps } from './empty-state';

// ── Result ────────────────────────────────────────────────
export { Result, type ResultComponentProps, type ResultSlot, type ResultStatus, type ResultSize, type ResultIconProps, type ResultTitleProps, type ResultDescriptionProps, type ResultExtraProps } from './result';

// ── LoadPanel ──────────────────────────────────────────────
export { LoadPanel, type LoadPanelComponentProps, type LoadPanelSlot, type LoadPanelSize, type LoadPanelBackdrop, type LoadPanelSpinnerProps, type LoadPanelMessageProps } from './load-panel';

// ── Toast ──────────────────────────────────────────────────
export { Toast, type ToastComponentProps, type ToastSlot, type ToastIconProps, type ToastTitleProps, type ToastDescriptionProps, type ToastCloseButtonProps } from './toast';
export { useToast, type UseToastProps, type UseToastReturn } from './toast';

// ── AlertDialog ────────────────────────────────────────────
export { AlertDialog, type AlertDialogComponentProps, type AlertDialogSlot, type AlertDialogTitleProps, type AlertDialogDescriptionProps, type AlertDialogActionsProps, type AlertDialogCancelButtonProps, type AlertDialogConfirmButtonProps } from './alert-dialog';

// ── NotificationCenter ─────────────────────────────────────
export { NotificationCenter, type NotificationCenterComponentProps, type NotificationCenterSlot, type NotificationCenterHeaderProps, type NotificationCenterItemProps, type NotificationCenterEmptyStateProps } from './notification-center';
export { useNotificationCenter, type UseNotificationCenterProps, type UseNotificationCenterReturn } from './notification-center';

// ── Tour ─────────────────────────────────────────────────
export { Tour, type TourComponentProps, type TourSlot, type TourStepProps, type TourStepTitleProps, type TourStepContentProps, type TourNavigationProps } from './tour';

// ── SplashScreen ─────────────────────────────────────────
export { SplashScreen, type SplashScreenComponentProps, type SplashScreenSlot, type SplashScreenLogoProps, type SplashScreenTitleProps, type SplashScreenProgressProps, type SplashScreenVersionProps } from './splash-screen';

// ── ValidationSummary ────────────────────────────────────
export { ValidationSummary, type ValidationSummaryComponentProps, type ValidationSummarySlot, type ValidationSummaryItemProps, type ValidationSummaryIconProps, type ValidationSummaryTitleProps } from './validation-summary';

// ── Modal ────────────────────────────────────────────────
export { Modal, type ModalComponentProps, type ModalSlot, type ModalHeaderProps, type ModalBodyProps, type ModalFooterProps, type ModalCloseButtonProps } from './modal';

// ── Drawer ───────────────────────────────────────────────
export { Drawer, type DrawerComponentProps, type DrawerSlot, type DrawerHeaderProps, type DrawerBodyProps, type DrawerFooterProps, type DrawerCloseButtonProps } from './drawer';

// ── Popover ─────────────────────────────────────────────
export { Popover, type PopoverComponentProps, type PopoverSlot, type PopoverTriggerProps, type PopoverContentProps, type PopoverArrowProps } from './popover';

// ── Tooltip ─────────────────────────────────────────────
export { Tooltip, type TooltipComponentProps, type TooltipSlot, type TooltipTriggerProps, type TooltipContentProps } from './tooltip';

// ── ContextMenu ─────────────────────────────────────────
export { ContextMenu, type ContextMenuComponentProps, type ContextMenuSlot } from './context-menu';

// ── DropdownMenu ────────────────────────────────────────
export { DropdownMenu, useDropdownMenuContext, type DropdownMenuComponentProps, type DropdownMenuSlot, type DropdownMenuItemProps, type DropdownMenuSeparatorProps, type DropdownMenuGroupProps } from './dropdown-menu';

// ── Flyout ──────────────────────────────────────────────
export { Flyout, type FlyoutComponentProps, type FlyoutSlot, type FlyoutTriggerProps, type FlyoutContentProps, type FlyoutHeaderProps, type FlyoutBodyProps } from './flyout';

// ── Accordion ───────────────────────────────────────────
export { Accordion, type AccordionComponentProps, type AccordionSlot, type AccordionItemDef, type AccordionItemProps, type AccordionTriggerProps, type AccordionContentProps } from './accordion';

// ── Card ────────────────────────────────────────────────
export { Card, type CardComponentProps, type CardSlot, type CardVariant, type CardMedia, type CardHeaderProps, type CardBodyProps, type CardFooterProps } from './card';

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

// ── DigitalGauge ────────────────────────────────────────
export { DigitalGauge, type DigitalGaugeComponentProps, type DigitalGaugeSlot, type DigitalGaugeSize, type DigitalGaugeDisplayProps, type DigitalGaugeLabelProps, type DigitalGaugeUnitProps, type DigitalGaugeMinMaxProps } from './digital-gauge';
export { useDigitalGauge, type UseDigitalGaugeProps, type UseDigitalGaugeReturn } from './digital-gauge';

// ── LiveTile ────────────────────────────────────────────
export { LiveTile, type LiveTileComponentProps, type LiveTileSlot, type LiveTileSize, type LiveTileFaceProps, type LiveTileIndicatorProps } from './live-tile';
export { useLiveTile, type UseLiveTileProps, type UseLiveTileReturn } from './live-tile';

// ── NumberFormatter ─────────────────────────────────────
export { NumberFormatter, type NumberFormatterComponentProps, type NumberFormatterSlot, type NumberFormatStyle, type NumberFormatNotation, type NumberFormatterValueProps, type NumberFormatterPrefixProps, type NumberFormatterSuffixProps } from './number-formatter';

// ── DateFormatter ───────────────────────────────────────
export { DateFormatter, type DateFormatterComponentProps, type DateFormatterSlot, type DateFormatDateStyle, type DateFormatTimeStyle, type DateInput, type DateFormatterValueProps, type DateFormatterPrefixProps, type DateFormatterSuffixProps } from './date-formatter';

// ── Watermark ──────────────────────────────────────────
export { Watermark, type WatermarkComponentProps, type WatermarkSlot, type WatermarkSize, type WatermarkContentProps, type WatermarkOverlayProps } from './watermark';

// ── QRCode ─────────────────────────────────────────────
export { QRCode, type QRCodeComponentProps, type QRCodeSlot, type QRCodeSize, type QRCodeSvgProps, type QRCodeLabelProps } from './qrcode';

// ── Carousel ────────────────────────────────────────────
export { Carousel, type CarouselComponentProps, type CarouselSlot, type CarouselViewportProps, type CarouselSlideProps, type CarouselPrevButtonProps, type CarouselNextButtonProps, type CarouselIndicatorsProps } from './carousel';
export { useCarousel, type UseCarouselProps, type UseCarouselReturn } from './carousel';

// ── Clock ───────────────────────────────────────────────
export { Clock, type ClockComponentProps, type ClockSlot, type ClockMode, type ClockSize, type ClockFaceProps, type ClockDigitalProps, type ClockPeriodProps } from './clock';
export { useClock, type UseClockProps, type UseClockReturn } from './clock';
