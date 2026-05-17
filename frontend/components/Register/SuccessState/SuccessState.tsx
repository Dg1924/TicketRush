import { CheckCircle } from "lucide-react";

const SuccessState = () => {
  return (
    <div className="text-center">
      <CheckCircle className="text-green-400 w-10 h-10 mx-auto" />
      <p className="text-white">Đăng ký thành công</p>
    </div>
  );
};

export default SuccessState;
