import React from "react";

/**
 * SkeletonBox: animated placeholder
 * @param {object} props
 * @param {string} props.className
 */
const SkeletonBox = ({ className = "", ...props }) => (
  <div
    className={`bg-gray-200 rounded animate-pulse ${className}`}
    {...props}
  />
);

export default SkeletonBox;