type Props = {
  seed: string;
};

const QRCode = ({ seed }: Props) => {
  const hash = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const cells = Array.from(
    { length: 49 },
    (_, index) => ((hash * (index + 1) * 7) % 17) > 7
  );

  return (
    <div className="w-32 h-32 bg-white rounded-lg p-2">
      <div className="w-full h-full bg-[#08080f] rounded grid grid-cols-7 grid-rows-7 gap-0.5 p-1">
        {cells.map((active, index) => (
          <div
            key={index}
            className={`rounded-sm ${active ? "bg-white" : "bg-transparent"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QRCode;
