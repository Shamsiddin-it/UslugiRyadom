import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { useUpdateMasterProfileMutation } from '@/features/masters/masters.queries';
import { masterProfileSchema, type MasterProfileFormValues } from '@/components/forms/form.schemas';
import { CitySelect } from '@/components/shared/CitySelect';
import { DistrictSelect } from '@/components/shared/DistrictSelect';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { MasterProfile } from '@/types/master';

interface MasterProfileFormProps {
  profile: MasterProfile;
}

export function MasterProfileForm({ profile }: MasterProfileFormProps) {
  const mutation = useUpdateMasterProfileMutation();
  const { data: categories } = useCategoriesQuery();
  const form = useForm<MasterProfileFormValues>({
    resolver: zodResolver(masterProfileSchema),
    defaultValues: {
      profession: profile.profession,
      experience: profile.experience,
      about: profile.about ?? '',
      city: profile.address.city ?? '',
      district: profile.address.district ?? '',
      street: profile.address.street ?? '',
      house: profile.address.house ?? '',
      landmark: profile.address.landmark ?? '',
      categoryIds: profile.categories.map((category) => category.id),
    },
  });

  const city = form.watch('city');

  useEffect(() => {
    form.setValue('district', '');
  }, [city, form]);

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Профессия">
          <Input {...form.register('profession')} error={form.formState.errors.profession?.message} />
        </FormField>
        <FormField label="Опыт">
          <Input type="number" min={0} {...form.register('experience')} error={form.formState.errors.experience?.message} />
        </FormField>
      </div>

      <FormField label="О себе">
        <Textarea {...form.register('about')} error={form.formState.errors.about?.message} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Город">
          <CitySelect value={city ?? ''} onChange={(value) => form.setValue('city', value)} error={form.formState.errors.city?.message} />
        </FormField>
        <FormField label="Район">
          <DistrictSelect
            city={city}
            value={form.watch('district') ?? ''}
            onChange={(value) => form.setValue('district', value)}
            error={form.formState.errors.district?.message}
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        {form.formState.errors.categoryIds?.message ? <p className="text-xs text-red-600">{form.formState.errors.categoryIds.message}</p> : null}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={mutation.isPending}>
          Сохранить профиль
        </Button>
      </div>
    </form>
  );
}
