import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore, type AuditLog } from '@/stores/dataStore';
import { ScrollText, Search, User, Clock } from 'lucide-react';

export default function AuditLogPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { auditLogs } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companyLogs = auditLogs
    .filter((l) => l.company_id === companyId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = companyLogs.filter((log) => {
    const matchesSearch =
      !search ||
      log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      log.affected_employee_name.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      log.change_reason.toLowerCase().includes(search.toLowerCase());

    const matchesAction = filterAction === 'ALL' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'AUTO_SYSTEM':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'MANUAL_CORRECTION':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getActionLabel = (action: AuditLog['action']) => {
    switch (action) {
      case 'CREATE':
        return 'Buat';
      case 'UPDATE':
        return 'Ubah';
      case 'AUTO_SYSTEM':
        return 'Sistem';
      case 'MANUAL_CORRECTION':
        return 'Koreksi';
      default:
        return action;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        subtitle="Riwayat perubahan data sistem"
        backTo="/dashboard"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nama, tipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="ALL">Semua Aksi</option>
          <option value="CREATE">Buat</option>
          <option value="UPDATE">Ubah</option>
          <option value="AUTO_SYSTEM">Sistem</option>
          <option value="MANUAL_CORRECTION">Koreksi</option>
        </select>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Tidak ada log"
          description={search ? 'Tidak ditemukan log yang sesuai filter' : 'Belum ada aktivitas yang tercatat'}
        />
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getActionColor(log.action)} variant="outline">
                        {getActionLabel(log.action)}
                      </Badge>
                      <span className="text-sm font-medium">{log.entity_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.change_reason}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.actor_name} ({log.actor_role})
                      </span>
                      {log.affected_employee_name && (
                        <span>→ {log.affected_employee_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Show before/after data if available */}
                {(log.before_data || log.after_data) && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {log.before_data && (
                      <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-xs">
                        <p className="font-medium text-red-600 dark:text-red-400 mb-1">Sebelum:</p>
                        <pre className="whitespace-pre-wrap text-muted-foreground overflow-hidden">
                          {JSON.stringify(log.before_data, null, 1).slice(0, 100)}
                        </pre>
                      </div>
                    )}
                    {log.after_data && (
                      <div className="bg-green-50 dark:bg-green-950/20 p-2 rounded text-xs">
                        <p className="font-medium text-green-600 dark:text-green-400 mb-1">Sesudah:</p>
                        <pre className="whitespace-pre-wrap text-muted-foreground overflow-hidden">
                          {JSON.stringify(log.after_data, null, 1).slice(0, 100)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {companyLogs.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Menampilkan {filteredLogs.length} dari {companyLogs.length} log
        </p>
      )}
    </div>
  );
}
