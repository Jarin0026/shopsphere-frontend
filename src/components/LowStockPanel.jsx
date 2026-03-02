function LowStockPanel({ count }) {
  return (
    <div className="bg-red-100 text-red-700 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold">Low Stock Alert</h2>
      <p className="text-2xl font-bold mt-2">{count} products low in stock</p>
    </div>
  );
}

export default LowStockPanel;
