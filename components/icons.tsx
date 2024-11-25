import * as Icons from '@/icons/icons';

const IconsIndex = () => {
  const iconsArray = Object.entries(Icons);

  return (
    <div className="grid grid-cols-4 gap-4">
      {iconsArray.map(([name, IconComponent]) => (
        <div key={name} className="flex flex-col items-center">
          <IconComponent className="w-6 h-12 text-primary" />
          <p className="text-sm">{name}</p>
        </div>
      ))}
    </div>
  );
};

export default IconsIndex;
