// This function now returns the data needed for composeCast
// The actual composeCast call should be made in the component using useComposeCast hook
export function getShareData({
  _name,
  username,
}: {
  _name: string;
  username?: string;
}) {
  const text = username
    ? `I just collected "Name of Work" by handle`
    : `I just collected "Name of Work"`;

  return {
    text,
    embeds: ["https://mint.warpcast.com/"]
  };
}
