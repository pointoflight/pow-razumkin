import LoginForm from './LoginForm';

interface Props {
  params: { locale: string };
  searchParams: { from?: string };
}

export default function LoginPage({ params, searchParams }: Props) {
  const locale = params.locale ?? 'ru';
  const from = searchParams.from || `/${locale}`;
  return <LoginForm locale={locale} from={from} />;
}
