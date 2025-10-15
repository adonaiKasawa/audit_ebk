import * as React from "react";

function ControlPanel({ adress }: { adress: string }) {
  return (
    <div className="control-panel">
      <h3>{adress}</h3>
    </div>
  );
}

export default React.memo(ControlPanel);
