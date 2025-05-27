import { Card, CardContent } from "../GeneralComponents/card";

export default function DashboardCards({ acceptedCount, pendingCount, freeSlots }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold">Accepted Interns</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{acceptedCount}</p>
          
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold">Free Spots</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{freeSlots}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold">Pending Applications</h3>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
        </CardContent>
      </Card>
    </section>
  );
}
