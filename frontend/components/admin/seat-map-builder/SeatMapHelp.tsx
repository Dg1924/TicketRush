const SeatMapHelp = () => {
  return (
    <div className="mt-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl p-5">
      <h4 className="text-orange-400 text-xs font-bold uppercase mb-2">Hướng dẫn sử dụng:</h4>
      <ul className="text-gray-400 text-xs leading-relaxed space-y-1.5">
        <li className="flex gap-2">
          <span className="text-orange-500">•</span>
          <span>Sử dụng bảng bên trái để thêm/xóa dãy ghế, chỉnh số lượng ghế và gán hạng vé.</span>
        </li>
        <li className="flex gap-2">
          <span className="text-orange-500">•</span>
          <span>Bật <strong>"Chỉnh sửa ghế"</strong> ở bảng bên phải để chọn từng ghế muốn khóa (Disabled).</span>
        </li>
        <li className="flex gap-2">
          <span className="text-orange-500">•</span>
          <span>Những ghế bị khóa sẽ không thể được chọn bởi khách hàng khi mua vé.</span>
        </li>
      </ul>
    </div>
  );
};

export default SeatMapHelp;