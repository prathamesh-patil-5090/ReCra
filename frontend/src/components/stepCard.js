import React from 'react';

const StepCard = ({
  number,
  title,
  description,
  icon: Icon,
  className = "",
  onClick,
  customIcon,
}) => {
  const containerClasses = onClick
    ? `cursor-pointer w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`
    : `w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`;

  return (
    <div
      className={containerClasses}
      onClick={() => onClick(number)}
    >
      <div className="mb-4 flex justify-center">
        <div className="relative rounded-full bg-black-100 p-3 ">
          {customIcon ? (
            customIcon
          ) : Icon ? (
            <Icon className="h-6 w-6 text-black-600" />
          ) : null}
        </div>
      </div>
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );
};

StepCard.defaultProps = {
  onClick: null,
  className: "",
  customIcon: null,
};

export default StepCard;
