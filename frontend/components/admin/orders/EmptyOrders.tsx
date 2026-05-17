import { ShoppingBag } from "lucide-react";

const EmptyOrders = () => {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
        <ShoppingBag className="w-8 h-8 text-gray-600" />
      </div>

      <p className="text-gray-400">No orders yet.</p>
      <p className="text-gray-600 text-sm mt-1">
        Orders will appear here once customers complete purchases.
      </p>
    </div>
  );
};

export default EmptyOrders;
