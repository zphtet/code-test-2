import { Loader } from "lucide-react";

const LoaderComponent = () => {
  return (
    <div className="flex items-center pt-5 justify-center">
      <Loader className="animate-spin" />
    </div>
  );
};

export default LoaderComponent;
