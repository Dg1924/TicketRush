const AuthDivider = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-gray-600 text-xs">hoặc đăng nhập bằng email</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
};

export default AuthDivider;
