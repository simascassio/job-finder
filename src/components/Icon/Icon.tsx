import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-left" | "bell" | "briefcase" | "check" | "chevron-down" | "close" | "edit"
  | "eye" | "eye-off" | "filter" | "logout" | "menu" | "moon" | "plus" | "search"
  | "settings" | "sparkles" | "sun" | "trash" | "pause" | "play" | "user";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

const paths: Record<IconName, ReactNode> = {
  "arrow-left": <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  "chevron-down": <path d="m6 9 6 6 6-6"/>,
  close: <><path d="M6 6l12 12"/><path d="M18 6 6 18"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
  "eye-off": <><path d="m3 3 18 18"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c6.5 0 10 8 10 8a18.6 18.6 0 0 1-3.2 4.2"/><path d="M6.6 6.6C3.6 8.5 2 12 2 12s3.5 8 10 8c1.8 0 3.4-.5 4.8-1.2"/></>,
  filter: <><path d="M4 5h16"/><path d="M7 12h10"/><path d="M10 19h4"/></>,
  logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 5V4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-1"/></>,
  menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
  moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a2 2 0 1 0 2.6-2.8 2 2 0 0 0-1.6-.2"/><path d="M4.6 15a2 2 0 1 1-2.6-2.8 2 2 0 0 1 1.6-.2"/><path d="M15 4.6a2 2 0 1 0-2.8-2.6 2 2 0 0 0-.2 1.6"/><path d="M9 19.4a2 2 0 1 0 2.8 2.6 2 2 0 0 0 .2-1.6"/></>,
  sparkles: <><path d="m12 3-1.3 3.7L7 8l3.7 1.3L12 13l1.3-3.7L17 8l-3.7-1.3Z"/><path d="m19 14-.7 2.3L16 17l2.3.7L19 20l.7-2.3L22 17l-2.3-.7Z"/><path d="m5 14-.6 1.9L2.5 17l1.9.6L5 19.5l.6-1.9 1.9-.6-1.9-.6Z"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>,
  trash: <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>,
  pause: <><path d="M7 5v14"/><path d="M17 5v14"/></>,
  play: <path d="m8 5 11 7-11 7Z"/>,
  user: <><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
};

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
