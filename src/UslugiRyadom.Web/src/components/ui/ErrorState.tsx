import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Не удалось загрузить данные',
  description = 'Попробуйте обновить страницу или повторить действие позже.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-red-100 bg-red-50">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-red-700">{title}</h3>
        <p className="text-sm text-red-600">{description}</p>
        {onRetry ? (
          <div>
            <Button variant="danger" onClick={onRetry}>
              Повторить
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
