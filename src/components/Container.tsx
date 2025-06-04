import React from "react";

// Again I suppose creating interfaces is required for passing props
interface ContainerProps {
  children: React.ReactNode;
}

// A component to put our main content within without having to repeat styles
// TODO: Change this to react to the size of our website
export default function Container({ children }: ContainerProps) {
  return <div className="w-[80%] mx-auto mt-8">{children}</div>;
}
