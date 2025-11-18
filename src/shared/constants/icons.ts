/**
 * Lucide React Icons - LifePro
 * Centralizovaný export všech ikon pro konzistenci
 */

import {
  // Navigation
  Home,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,

  // LifePro Specific
  Heart,           // Srdcovka (favorite)
  Star,
  Sparkles,
  Brain,
  Compass,
  Target,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  Globe,
  Leaf,

  // Actions
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Download,
  Upload,
  Share2,
  Copy,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,

  // Categories (JSEM, VÍM, UMÍM, MÁM RÁD/A)
  UserCircle,      // JSEM
  BookText,        // VÍM
  Wrench,          // UMÍM
  SmilePlus,       // MÁM RÁD/A
  Clock,           // Minulost
  Calendar,        // Budoucnost

  // UI Elements
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  MoreVertical,
  MoreHorizontal,

  // Media
  Image,
  FileText,
  File,
  Folder,

  // Communication
  Mail,
  MessageCircle,
  Send,

  // Status
  Loader,
  RefreshCw,

} from 'lucide-react';

// Navigation Icons
export const NAVIGATION_ICONS = {
  dashboard: LayoutDashboard,
  home: Home,
  profile: User,
  results: Brain,
  compass: Compass,
};

// Settings Icons
export const SETTINGS_ICONS = {
  settings: Settings,
  logout: LogOut,
  menu: Menu,
  close: X,
};

// UI Icons - LifePro Specific
export const UI_ICONS = {
  srdcovka: Heart,         // Favorite button
  sparkles: Sparkles,
  star: Star,
  target: Target,
  lightbulb: Lightbulb,
  check: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

// Category Icons - Odpovídá kategoriím z PDF
export const CATEGORY_ICONS = {
  jsem: UserCircle,        // JSEM (přítomnost)
  vim: BookText,           // VÍM (znalosti)
  umim: Wrench,            // UMÍM (dovednosti)
  mamRad: SmilePlus,       // MÁM RÁD/A (preference)
  minulost: Clock,         // Časové období - minulost
  budoucnost: Calendar,    // Časové období - budoucnost
};

// Section Icons
export const SECTION_ICONS = {
  role: Users,
  studium: GraduationCap,
  dovednosti: Wrench,
  prace: Briefcase,
  planeta: Globe,
  priroda: Leaf,
};

// Action Icons
export const ACTION_ICONS = {
  add: Plus,
  remove: Minus,
  edit: Edit,
  delete: Trash2,
  save: Save,
  download: Download,
  upload: Upload,
  share: Share2,
  copy: Copy,
};

// Chevron Icons
export const CHEVRON_ICONS = {
  right: ChevronRight,
  left: ChevronLeft,
  down: ChevronDown,
  up: ChevronUp,
};

// Status Icons
export const STATUS_ICONS = {
  loading: Loader,
  refresh: RefreshCw,
  success: CheckCircle,
  error: XCircle,
};

// Export all for convenience
export {
  Home,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  Star,
  Sparkles,
  Brain,
  Compass,
  Target,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  Globe,
  Leaf,
  Plus,
  Edit,
  Trash2,
  Save,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Loader,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
};
