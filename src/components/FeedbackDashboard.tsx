import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FeedbackStats } from '@/types/feedback';
import { BarChart3, Target, Users, Star, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FeedbackDashboardProps {
  stats: FeedbackStats;
  onFilter: (rating?: number) => void;
  activeFilter?: number;
}

export const FeedbackDashboard = ({ stats, onFilter, activeFilter }: FeedbackDashboardProps) => {
  const [chartType, setChartType] = useState<'bar' | 'doughnut'>('bar');

  const chartData = {
    labels: ['1 Estrela', '2 Estrelas', '3 Estrelas', '4 Estrelas', '5 Estrelas'],
    datasets: [
      {
        label: 'Número de Avaliações',
        data: [
          stats.distribution[1],
          stats.distribution[2], 
          stats.distribution[3],
          stats.distribution[4],
          stats.distribution[5]
        ],
        backgroundColor: [
          'hsl(0 84% 60%)',     // Red for 1 star
          'hsl(25 95% 53%)',    // Orange for 2 stars  
          'hsl(48 96% 53%)',    // Yellow for 3 stars
          'hsl(142 76% 45%)',   // Light Green for 4 stars
          'hsl(142 76% 36%)',   // Green for 5 stars
        ],
        borderColor: [
          'hsl(0 84% 50%)',
          'hsl(25 95% 43%)',
          'hsl(48 96% 43%)',
          'hsl(142 76% 35%)',
          'hsl(142 76% 26%)',
        ],
        borderWidth: 2,
        borderRadius: chartType === 'bar' ? 8 : 0,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartType === 'doughnut',
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribuição das Avaliações',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = stats.total;
            const count = context.parsed?.y || context.parsed;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
            return `${count} avaliações (${percentage}%)`;
          },
        },
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    } : {},
  };

  const getScoreColor = (average: number) => {
    if (average >= 4) return 'text-radar-secondary';
    if (average >= 3) return 'text-yellow-500';
    return 'text-destructive';
  };

  const getScoreDescription = (average: number) => {
    if (average >= 4.5) return 'Excelente';
    if (average >= 4) return 'Muito Bom';
    if (average >= 3) return 'Bom';
    if (average >= 2) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-radar-primary/5 to-radar-primary/10 border-radar-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-radar-primary/10 rounded-full">
              <Users className="text-radar-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Feedbacks</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-radar-secondary/5 to-radar-secondary/10 border-radar-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-radar-secondary/10 rounded-full">
              <Star className="text-radar-secondary fill-current" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avaliação Média</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${getScoreColor(stats.average)}`}>
                  {stats.average.toFixed(1)}
                </p>
                <span className="text-sm text-muted-foreground">
                  {getScoreDescription(stats.average)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-full">
              <TrendingUp className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfação</p>
              <p className="text-2xl font-bold">
                {stats.total > 0 ? 
                  Math.round(((stats.distribution[4] + stats.distribution[5]) / stats.total) * 100) :
                  0
                }%
              </p>
              <p className="text-xs text-muted-foreground">Notas 4 e 5</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-radar-primary" size={20} />
              <h3 className="text-lg font-semibold">Análise de Avaliações</h3>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                Barras
              </Button>
              <Button
                variant={chartType === 'doughnut' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('doughnut')}
              >
                Rosca
              </Button>
            </div>
          </div>

          {stats.total > 0 ? (
            <div className="h-80">
              {chartType === 'bar' ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Doughnut data={chartData} options={chartOptions} />
              )}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Target size={48} />
                <p>Aguardando feedbacks para gerar gráficos</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Filter Options */}
      {stats.total > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="text-radar-primary" size={20} />
              Filtros Rápidos
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!activeFilter ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilter()}
              >
                Todos ({stats.total})
              </Button>
              
              <Button
                variant={activeFilter === 5 ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilter(5)}
              >
                5 Estrelas ({stats.distribution[5]})
              </Button>
              
              <Button
                variant={activeFilter === 4 ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilter(4)}
              >
                4+ Estrelas ({stats.distribution[4] + stats.distribution[5]})
              </Button>
              
              <Button
                variant={activeFilter === 3 ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilter(3)}
              >
                3+ Estrelas ({stats.distribution[3] + stats.distribution[4] + stats.distribution[5]})
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Clique nos filtros para ver apenas feedbacks com a avaliação selecionada ou superior.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};