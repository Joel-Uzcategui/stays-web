import { notFound } from 'next/navigation';

import { getAdminAmenity } from '@/actions';
import { PageHeader } from '@/components';

import { AmenityForm } from './ui/AmenityForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminAmenityPage({ params }: Props) {
  const { id } = await params;

  const isNew = id === 'new';
  const amenity = isNew ? null : await getAdminAmenity(id);

  if (!isNew && !amenity) {
    notFound();
  }

  return (
    <>
      <PageHeader
        kicker={isNew ? 'Catalog · New' : 'Catalog · Edit'}
        title={isNew ? 'New amenity' : (amenity?.name ?? '')}
      />

      <section className="px-7 pt-6 pb-10">
        <AmenityForm amenity={amenity ?? undefined} />
      </section>
    </>
  );
}
