import { query } from "@/lib/db";

export default async function Page() {
  try {
    const result = await query("SELECT * FROM testcategories");

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Categories</h1>

        {result.rows.length === 0 ? (
          <p className="text-gray-500">No categories found</p>
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
                {result.rows.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 border font-medium">{c.name}</td>
                    <td className="p-3 border">{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error("CATEGORY ERROR:", err);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Test Categories</h1>
        <p className="text-red-600">Failed to load categories</p>
      </div>
    );
  }
}