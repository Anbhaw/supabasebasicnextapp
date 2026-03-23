import { query } from "@/lib/db";

export default async function Page() {
  try {
    const result = await query("SELECT * FROM uom");

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Units of Measure (UOM)</h1>

        {result.rows.length === 0 ? (
          <p className="text-gray-500">No UOM data found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-left text-sm uppercase">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Description</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">{u.name}</td>
                    <td className="p-3 border">{u.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error("UOM ERROR:", err);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Units of Measure</h1>
        <p className="text-red-600">Failed to load UOM data</p>
      </div>
    );
  }
}