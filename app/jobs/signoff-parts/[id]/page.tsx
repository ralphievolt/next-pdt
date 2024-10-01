import ResultForm from '@/components/jobs/so-parts-list/index';

import {getSoPartDetails} from "@/app/jobs/signoff-parts/[id]/fetcher/soparts-details"


export default async function Home({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = await getSoPartDetails(id);

  return <ResultForm job={data} />;
}
