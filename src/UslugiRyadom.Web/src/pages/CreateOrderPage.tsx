import { OrderForm } from '@/components/forms/OrderForm';
import { SectionHeader } from '@/components/layout/SectionHeader';

export function CreateOrderPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Новый заказ"
        title="Создайте заявку для мастера"
        description="Укажите задачу, бюджет и адрес. После создания заказ появится в системе и станет доступен подходящим мастерам."
      />
      <OrderForm />
    </div>
  );
}
