const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-[8px] border border-amber-200/10 bg-white/[0.065] shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl">
    <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-[#2b1710] via-[#3b2118] to-[#160906]" />
    <div className="space-y-4 p-6">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/12" />
      <div className="space-y-2">
        <div className="h-3 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="flex justify-between pt-4">
        <div className="h-4 w-20 animate-pulse rounded-full bg-white/10" />
        <div className="h-10 w-36 animate-pulse rounded-full bg-[#d6ae61]/20" />
      </div>
    </div>
  </div>
)

export default ProductSkeleton
