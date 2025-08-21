import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FeedbackForm } from '@/components/FeedbackForm';
import { FeedbackList } from '@/components/FeedbackList';
import { FeedbackDashboard } from '@/components/FeedbackDashboard';
import { useFeedback } from '@/hooks/useFeedback';
import { Radar, MessageSquare, BarChart3, Sparkles } from 'lucide-react';

const Index = () => {
  const { feedbacks, addFeedback, getStats, filterByRating } = useFeedback();
  const [activeFilter, setActiveFilter] = useState<number | undefined>();

  const stats = getStats();
  const displayFeedbacks = activeFilter ? filterByRating(activeFilter) : feedbacks;

  const handleFilter = (rating?: number) => {
    setActiveFilter(rating);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-radar-light">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-radar-primary to-radar-secondary rounded-2xl shadow-lg">
              <Radar className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-radar-primary to-radar-secondary bg-clip-text text-transparent">
                Feedback Radar
              </h1>
              <p className="text-muted-foreground">
                Sistema inteligente de coleta e análise de feedbacks
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="form" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-96 mx-auto">
            <TabsTrigger value="form" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Novo Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Sparkles size={16} />
              <span className="hidden sm:inline">Feedbacks</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <FeedbackForm onSubmit={addFeedback} />
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <FeedbackDashboard 
              stats={stats} 
              onFilter={handleFilter}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <div className="max-w-4xl mx-auto">
              <FeedbackList 
                feedbacks={displayFeedbacks} 
                filterRating={activeFilter}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        {stats.total > 0 && (
          <Card className="mt-12 p-6 bg-gradient-to-r from-radar-primary/5 to-radar-secondary/5 border-radar-primary/20">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Resumo Rápido</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <span><strong>{stats.total}</strong> feedbacks coletados</span>
                <span><strong>{stats.average.toFixed(1)}</strong> avaliação média</span>
                <span><strong>{Math.round(((stats.distribution[4] + stats.distribution[5]) / (stats.total || 1)) * 100)}%</strong> de satisfação</span>
                <span><strong>{stats.distribution[5]}</strong> avaliações 5 estrelas</span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
