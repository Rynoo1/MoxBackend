import React from "react";

const PriorityIndicator = ({ priority }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "yellow";
      default:
        return "green";
    }
  };

  return (
    <div style={{ backgroundColor: getPriorityColor(), padding: "5px" }}>
      {priority} Priority
    </div>
  );
};

export default PriorityIndicator;
