import { getCostData, getProductData } from "@/actions/form";
import { CostBarChart } from "@/components/CostBarChart";
import { CostPieChart } from "@/components/CostPieChart";
import CostTable from "@/components/CostTable";
import { ProfitBarChart } from "@/components/ProfitBarChart";
import { RevenueBarChart } from "@/components/RevenueBarChart";
import TableData from "@/components/TableData";
import { TrendLineChart } from "@/components/TrendLineChart";
import { auth } from "@clerk/nextjs/server";


interface ThornliePageProps {
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
}

const ThornliePage = async ({ searchParams }: ThornliePageProps) => {
  await auth.protect();
  const { startDate, endDate } = await searchParams;

  const [productData, costData] = await Promise.all([
    getProductData(
      startDate ? new Date(startDate) : undefined, 
      endDate ? new Date(endDate) : undefined, 
      "Thornlie"
    ),

    getCostData(
      startDate ? new Date(startDate) : undefined, 
      endDate ? new Date(endDate) : undefined, 
      undefined, 
      "Thornlie",
    ),
  ]) 

  return (
    <div className="flex gap-4 items-stretch">
      {/* LEFT */}
      <div className="flex flex-col flex-1 gap-4 w-[60%]">
        {/* TOP */}
        <div className="flex gap-4 items-stretch">
          <div className="w-[50%]">
            <RevenueBarChart data={productData} />
          </div>
          <div className="w-[50%]">
            <CostBarChart data={costData} />
          </div>
        </div>
        {/* MIDDLE */}
        <div className="flex gap-4 items-stretch">
          <div className="w-[50%]">
            <CostPieChart data={costData} />
          </div>
          <div className="w-[50%]">
            <ProfitBarChart costData={costData} productData={productData} />
          </div>
        </div>
        {/* BOTTOM */}
        <div className="flex-1">
          <TrendLineChart costData={costData} productData={productData} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col gap-4 w-[40%]">
        <div className="overflow-x-auto flex-1">
          <TableData
            productData={productData}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
        <div className="overflow-x-auto flex-1">
          <CostTable data={costData} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
};

export default ThornliePage;