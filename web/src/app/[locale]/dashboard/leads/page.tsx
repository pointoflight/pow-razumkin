import LeadsClient from './LeadsClient';

interface Props {
  searchParams: { orgId?: string };
}

export default function LeadsPage({ searchParams }: Props) {
  return <LeadsClient orgId={searchParams.orgId || ''} />;
}
