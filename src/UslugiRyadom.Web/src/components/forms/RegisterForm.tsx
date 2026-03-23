import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useRegisterMutation } from '@/features/auth/auth.queries';
import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { CitySelect } from '@/components/shared/CitySelect';
import { DistrictSelect } from '@/components/shared/DistrictSelect';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { registerSchema, type RegisterFormValues } from '@/components/forms/form.schemas';

export function RegisterForm() {
  const mutation = useRegisterMutation();
  const { data: categories } = useCategoriesQuery();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'client',
      city: '',
      district: '',
      street: '',
      house: '',
      landmark: '',
      profession: '',
      experience: 0,
      about: '',
      categoryIds: [],
    },
  });

  const selectedCity = form.watch('city');
  const role = form.watch('role');

  useEffect(() => {
    form.setValue('district', '');
  }, [selectedCity, form]);

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Регистрация</h1>
        <p className="text-sm text-slate-500">Создайте аккаунт клиента или мастера.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="ФИО">
          <Input {...form.register('fullName')} error={form.formState.errors.fullName?.message} />
        </FormField>
        <FormField label="Телефон">
          <Input placeholder="+992900000000" {...form.register('phone')} error={form.formState.errors.phone?.message} />
        </FormField>
        <FormField label="Email">
          <Input {...form.register('email')} error={form.formState.errors.email?.message} />
        </FormField>
        <FormField label="Роль">
          <Select
            {...form.register('role')}
            options={[
              { value: 'client', label: 'Клиент' },
              { value: 'master', label: 'Мастер' },
            ]}
          />
        </FormField>
        <FormField label="Пароль">
          <Input type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
        </FormField>
        <FormField label="Подтвердите пароль">
          <Input type="password" {...form.register('confirmPassword')} error={form.formState.errors.confirmPassword?.message} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Город">
          <CitySelect value={selectedCity} onChange={(value) => form.setValue('city', value)} error={form.formState.errors.city?.message} />
        </FormField>
        <FormField label="Район">
          <DistrictSelect
            city={selectedCity}
            value={form.watch('district')}
            onChange={(value) => form.setValue('district', value)}
            error={form.formState.errors.district?.message}
          />
        </FormField>
        <FormField label="Улица">
          <Input {...form.register('street')} error={form.formState.errors.street?.message} />
        </FormField>
        <FormField label="Дом">
          <Input {...form.register('house')} error={form.formState.errors.house?.message} />
        </FormField>
      </div>

      <FormField label="Ориентир">
        <Input {...form.register('landmark')} error={form.formState.errors.landmark?.message} />
      </FormField>

      {role === 'master' ? (
        <div className="space-y-4 rounded-3xl border border-primary/20 bg-primary-light/30 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Профиль мастера</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Профессия">
              <Input {...form.register('profession')} error={form.formState.errors.profession?.message} />
            </FormField>
            <FormField label="Опыт (лет)">
              <Input type="number" min={0} {...form.register('experience')} error={form.formState.errors.experience?.message} />
            </FormField>
          </div>
          <FormField label="О себе">
            <Textarea {...form.register('about')} error={form.formState.errors.about?.message} />
          </FormField>
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Категории услуг</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(categories ?? []).map((category) => (
                <label key={category.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={form.watch('categoryIds').includes(category.id)}
                    onChange={(event) => {
                      const current = form.getValues('categoryIds');
                      form.setValue(
                        'categoryIds',
                        event.target.checked ? [...current, category.id] : current.filter((id) => id !== category.id),
                      );
                    }}
                  />
                  {category.name}
                </label>
              ))}
            </div>
            {form.formState.errors.categoryIds?.message ? (
              <p className="text-xs text-red-600">{form.formState.errors.categoryIds.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <Button type="submit" className="w-full" isLoading={mutation.isPending}>
        Создать аккаунт
      </Button>

      <p className="text-sm text-slate-500">
        Уже есть аккаунт?{' '}
        <Link className="font-medium text-primary" to="/login">
          Войти
        </Link>
      </p>
    </form>
  );
}
