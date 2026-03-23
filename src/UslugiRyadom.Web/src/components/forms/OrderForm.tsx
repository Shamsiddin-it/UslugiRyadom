import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCategoriesQuery } from '@/features/categories/categories.queries';
import { useCreateOrderMutation } from '@/features/orders/orders.queries';
import { createOrderSchema, type CreateOrderFormValues } from '@/components/forms/form.schemas';
import { CitySelect } from '@/components/shared/CitySelect';
import { DistrictSelect } from '@/components/shared/DistrictSelect';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

export function OrderForm() {
  const navigate = useNavigate();
  const mutation = useCreateOrderMutation();
  const { data: categories } = useCategoriesQuery();
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      city: '',
      district: '',
      street: '',
      house: '',
      landmark: '',
      price: 0,
      paymentType: 'cash',
    },
  });

  const city = form.watch('city');

  useEffect(() => {
    form.setValue('district', '');
  }, [city, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const order = await mutation.mutateAsync(values);
    navigate(`/orders/${order.id}`);
  });

  return (
    <Card className="space-y-5">
      <form className="space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Название">
            <Input {...form.register('title')} error={form.formState.errors.title?.message} />
          </FormField>
          <FormField label="Категория">
            <Select
              {...form.register('categoryId')}
              placeholder="Выберите категорию"
              options={(categories ?? []).map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              error={form.formState.errors.categoryId?.message}
            />
          </FormField>
        </div>

        <FormField label="Описание">
          <Textarea {...form.register('description')} error={form.formState.errors.description?.message} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Город">
            <CitySelect value={city} onChange={(value) => form.setValue('city', value)} error={form.formState.errors.city?.message} />
          </FormField>
          <FormField label="Район">
            <DistrictSelect
              city={city}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Бюджет">
            <Input type="number" min={1} {...form.register('price')} error={form.formState.errors.price?.message} />
          </FormField>
          <FormField label="Тип оплаты">
            <Select
              {...form.register('paymentType')}
              options={[
                { value: 'cash', label: 'Наличные' },
                { value: 'card', label: 'Карта' },
              ]}
              error={form.formState.errors.paymentType?.message}
            />
          </FormField>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={mutation.isPending}>
            Создать заказ
          </Button>
        </div>
      </form>
    </Card>
  );
}
