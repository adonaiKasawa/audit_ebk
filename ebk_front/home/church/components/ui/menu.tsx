import React from "react";

const Menu = ({ title, key }: { title: string; key: string }) => {
  return (
    <div key={key} className="my-2">
      {title}
    </div>
  );
};

export default Menu;
