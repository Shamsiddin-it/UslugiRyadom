import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { roleLabels } from '@/utils/constants';
import { formatDate, formatPhone } from '@/utils/format';
import type { AdminUser } from '@/types/user';

interface UsersTableProps {
  users: AdminUser[];
  onToggleBlock: (user: AdminUser) => void;
}

export function UsersTable({ users, onToggleBlock }: UsersTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Пользователь</th>
              <th className="px-4 py-3">Роль</th>
              <th className="px-4 py-3">Телефон</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Создан</th>
              <th className="px-4 py-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{user.fullName}</div>
                  <div className="text-slate-500">{user.email}</div>
                </td>
                <td className="px-4 py-3">{roleLabels[user.role]}</td>
                <td className="px-4 py-3">{formatPhone(user.phone)}</td>
                <td className="px-4 py-3">{user.isBlocked ? <Badge tone="danger">Заблокирован</Badge> : <Badge tone="success">Активен</Badge>}</td>
                <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant={user.isBlocked ? 'primary' : 'danger'} onClick={() => onToggleBlock(user)}>
                    {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
