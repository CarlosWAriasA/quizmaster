interface LoadingSpinnerProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  borderWidth?: string;
}

const LoadingSpinner = ({
  width = 40,
  height = 40,
  color = "border-purple-500",
  borderWidth = "border-4",
}: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center">
      <div
        className={`animate-spin rounded-full border-t-transparent ${color} ${borderWidth}`}
        style={{ width, height }}
      />
    </div>
  );
};

export default LoadingSpinner;
