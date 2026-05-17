const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex gap-2 mb-6">
      {tags.map((tag) => (
        <span key={tag} className="text-gray-400 text-xs">
          {tag}
        </span>
      ))}
    </div>
  );
};

export default EventTags;
