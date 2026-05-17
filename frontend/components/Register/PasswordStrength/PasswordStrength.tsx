const PasswordStrength = ({ password }: { password: string }) => {
  const strength = password.length > 6 ? "Strong" : "Weak";

  return <p className="text-gray-400 text-xs">Strength: {strength}</p>;
};

export default PasswordStrength;
