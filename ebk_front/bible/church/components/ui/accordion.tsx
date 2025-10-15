import React from "react";
import { IoMdArrowDropleft, IoMdArrowDropdown } from "react-icons/io";

interface AccordionProps {
  item: { title: string; content: React.ReactNode };
  isOpen: boolean;
  handleToggle: () => void;
}

const AccordionM: React.FC<AccordionProps> = ({
  item,
  isOpen,
  handleToggle,
}) => {
  return (
    <div className="w-full max-w-md mx-auto border border-gray-200 rounded-md shadow-md">
      <div className="border-b border-gray-200">
        <button
          className="w-full flex items-center justify-between text-left px-4 py-2 font-medium text-gray-800 focus:outline-none"
          onClick={handleToggle}
        >
          <span className="flex items-center">
            {isOpen ? (
              <IoMdArrowDropdown className="h-5 w-5 mr-2" />
            ) : (
              <IoMdArrowDropleft className="h-5 w-5 mr-2" />
            )}
            {item.title}
          </span>
        </button>
        {isOpen && (
          <div className="px-4 py-2 text-gray-600">{item.content}</div>
        )}
      </div>
    </div>
  );
};

export default AccordionM;
