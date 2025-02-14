import { BounceLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <BounceLoader color="#3b82f6" size={60} />
    </div>
  );
}
