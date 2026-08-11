import { useQuery } from '@tanstack/react-query';
import { fetchProperties } from '../api/properties';

export function PropertySearch() {
  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties', { minPrice: 200000 }],
    queryFn: () => fetchProperties({ minPrice: 200000 }),
  });

  if (isLoading) return <p>Irish housing loading...</p>;
  if (error) return <p>Error loading data from the server.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Real estate search results</h2>
      <div className="grid grid-cols-3 gap-4">
        {properties?.map((property: any) => (
          <div key={property.id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{property.title}</h3>
            <p>Ціна: €{property.price}</p>
            <p>Спальні: {property.bedrooms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}