import { cn } from "@/lib/utils/cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
    className={cn("animate-pulse rounded-md bg-primary/10", className)}
    {...props}
  />
  );
};

export default Skeleton;
