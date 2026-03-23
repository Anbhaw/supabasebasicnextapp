import { query } from "@/lib/db";

async function getMedicalTests() {
  try {
    const result = await query(`
      SELECT 
        mt.name, 
        tc.name AS category, 
        u.name AS unit, 
        mt.normalmin, 
        mt.normalmax
      FROM medicaltests mt
      JOIN testcategories tc ON mt.idcategory = tc.id
      JOIN uom u ON mt.iduom = u.id
    `);

    return result.rows;
  } catch (err) {
    console.error("DB ERROR:", err);
    return [];
  }
}

export default async function Page() {
  const tests = await getMedicalTests();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Medical Tests</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm uppercase">
            <tr>
              <th className="p-3 border">Test Name</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Unit</th>
              <th className="p-3 border">Min</th>
              <th className="p-3 border">Max</th>
            </tr>
          </thead>

          <tbody>
            {tests.length > 0 ? (
              tests.map((t: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="p-3 border font-medium">{t.name}</td>
                  <td className="p-3 border">{t.category}</td>
                  <td className="p-3 border">{t.unit}</td>
                  <td className="p-3 border">{t.normalmin}</td>
                  <td className="p-3 border">{t.normalmax}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}