import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export function DashboardStats() {
  const stats = [
    {
      title: 'Total Migrations',
      value: '12',
      description: 'All time',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Completed',
      value: '8',
      description: 'Successfully finished',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'In Progress',
      value: '3',
      description: 'Currently running',
      icon: Clock,
      color: 'text-blue-600',
    },
    {
      title: 'Failed',
      value: '1',
      description: 'Requires attention',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
