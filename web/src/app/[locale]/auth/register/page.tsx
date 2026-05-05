import RegisterForm from './RegisterForm';

interface Props {
  params: { locale: string };
}

export default function RegisterPage({ params }: Props) {
  const locale = params.locale ?? 'ru';
  return <RegisterForm locale={locale} />;
}
