export function StrokePicker() {
  return <div className="flex gap-4"></div>;
}

export function StrokeItem() {
  return (
    <div className="btn">
      <svg
        aria-hidden="true"
        focusable="false"
        role="img"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M5 10h10"
          stroke="currentColor"
          stroke-width="3.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>
  );
}
