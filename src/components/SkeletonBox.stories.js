import SkeletonBox from "./SkeletonBox";

export default {
  title: "Components/SkeletonBox",
  component: SkeletonBox,
};

export const Default = () => (
  <div className="space-y-2 p-4">
    <SkeletonBox className="h-8 w-full" />
    <SkeletonBox className="h-4 w-1/2" />
  </div>
);