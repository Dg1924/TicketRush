type TermsCheckboxProps = {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
};

const TermsCheckbox = ({ agreed, setAgreed }: TermsCheckboxProps) => {
  return (
    <label className="flex gap-2 text-sm text-gray-400 items-center cursor-pointer">
      <input
        type="checkbox"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />
      Đồng ý điều khoản
    </label>
  );
};

export default TermsCheckbox;
