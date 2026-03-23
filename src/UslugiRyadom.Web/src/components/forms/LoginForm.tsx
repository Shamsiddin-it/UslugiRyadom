import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '@/features/auth/auth.queries';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/shared/FormField';
import { loginSchema, type LoginFormValues } from '@/components/forms/form.schemas';

export function LoginForm() {
  const mutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Вход в аккаунт</h1>
        <p className="text-sm text-slate-500">Войдите как клиент, мастер или администратор.</p>
      </div>

      <FormField label="Email">
        <Input placeholder="you@example.com" {...form.register('email')} error={form.formState.errors.email?.message} />
      </FormField>

      <FormField label="Пароль">
        <Input type="password" placeholder="Введите пароль" {...form.register('password')} error={form.formState.errors.password?.message} />
      </FormField>

      <Button type="submit" className="w-full" isLoading={mutation.isPending}>
        Войти
      </Button>

      <p className="text-sm text-slate-500">
        Нет аккаунта?{' '}
        <Link className="font-medium text-primary" to="/register">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
