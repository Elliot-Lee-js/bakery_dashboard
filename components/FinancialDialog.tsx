"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface FinancialDialogProps {
    data: {
        name: string,
        revenue: number,
        cost: number,
        costBreakdown: {
            rent: number, 
            water: number,
            electricity: number,
            salary: number,
        }
    }
}

const FinancialDialog = ({data}: FinancialDialogProps) => {
  return (
    <Dialog>
        {/* <DialogTrigger>
            <Button className="w-full">View Financials</Button>
        </DialogTrigger> */}
        <DialogTrigger render={<Button>View Financials</Button>} />
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Financials</DialogTitle>
                <div>
                    <h1 className="text-lg font-semibold">{data.name}</h1>
                    <div className="flex flex-col">
                        <div className="flex gap-2 border justify-between mt-1">
                            <p className="px-1">Revenue:</p>
                            <p className="px-1">${data.revenue.toLocaleString()}</p>
                            </div>
                        <div className="flex gap-2 border border-t-0 justify-between">
                            <p className="px-1">Cost:</p>
                            <p className="px-1">${data.cost.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 border border-t-0 justify-between mb-5">
                            <p className="px-1">Profit:</p>
                            <p className="px-1" >${(data.revenue - data.cost)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col">

                        <p className="mb-1 font-semibold">Cost Break Down:</p>
                        <div>
                        <div className="flex justify-between border px-1">
                            <p>Rent:</p>
                            <p>${data.costBreakdown.rent.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between border px-1 border-t-0">
                            <p>Water:</p>
                            <p>${data.costBreakdown.water.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between border px-1 border-t-0">
                            <p>Electricity:</p>
                            <p>${data.costBreakdown.electricity.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between border px-1 border-t-0">
                            <p>Salary:</p>
                            <p>${data.costBreakdown.salary.toLocaleString()}</p>
                        </div>
                        </div>
                    </div>
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default FinancialDialog