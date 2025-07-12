export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold" style={{ color: '#1B59AE' }}>
        Dashboard
      </h1>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center text-black text-sm font-medium border-2 border-black">
          U
        </div>
      </div>
    </div>
  );
}
