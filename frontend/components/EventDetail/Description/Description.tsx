const EventDescription = ({ description }: { description: string }) => {
  return (
    <div className="mb-6">
      <h2 className="text-white mb-2">About</h2>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default EventDescription;
