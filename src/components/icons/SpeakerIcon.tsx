import type { SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  muted?: boolean;
}

/** Speaker icon; shows an X when muted, sound waves when audible. */
export function SpeakerIcon({ muted = false, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <title>{muted ? 'Muted' : 'Sound'}</title>
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      {muted ? (
        <>
          <line x1="16" y1="9" x2="21" y2="15" />
          <line x1="21" y1="9" x2="16" y2="15" />
        </>
      ) : (
        <path d="M16 8a5 5 0 0 1 0 8" />
      )}
    </svg>
  );
}
