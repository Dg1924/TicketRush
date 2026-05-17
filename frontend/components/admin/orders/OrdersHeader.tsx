type Props = {
  total: number;
};

const OrdersHeader = ({ total }: Props) => {
  return (
    <div className="mb-8">
      <h1 className="text-white mb-1">Orders</h1>
      <p className="text-gray-400 text-sm">{total} total orders</p>
    </div>
  );
};

export default OrdersHeader;
