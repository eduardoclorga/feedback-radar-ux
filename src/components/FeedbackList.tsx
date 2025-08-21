import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, User, Calendar } from 'lucide-react';
import { Feedback } from '@/types/feedback';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FeedbackListProps {
  feedbacks: Feedback[];
  filterRating?: number;
}

export const FeedbackList = ({ feedbacks, filterRating }: FeedbackListProps) => {
  // Feedbacks are already filtered by the parent component
  const filteredFeedbacks = feedbacks;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-radar-secondary text-accent-foreground';
    if (rating >= 3) return 'bg-yellow-500 text-white';
    return 'bg-destructive text-destructive-foreground';
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Muito insatisfeito';
      case 2: return 'Insatisfeito';
      case 3: return 'Neutro';
      case 4: return 'Satisfeito';
      case 5: return 'Muito satisfeito';
      default: return '';
    }
  };

  if (filteredFeedbacks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <MessageCircle size={48} className="mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Nenhum feedback encontrado</h3>
            <p className="text-muted-foreground">
              {filterRating ? 
                `Nenhum feedback com avaliação ${filterRating}+ foi encontrado.` :
                'Seja o primeiro a deixar um feedback!'
              }
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Feedbacks Recebidos ({filteredFeedbacks.length})
        </h3>
        {filterRating && (
          <Badge variant="outline" className="border-radar-primary text-radar-primary">
            Avaliação {filterRating}+
          </Badge>
        )}
      </div>
      
      <div className="grid gap-4 max-h-[600px] overflow-y-auto">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-radar-primary/10 rounded-full">
                    <User size={16} className="text-radar-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{feedback.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} />
                      {format(new Date(feedback.date), "dd 'de' MMMM 'às' HH:mm", {
                        locale: ptBR
                      })}
                    </div>
                  </div>
                </div>
                
                <Badge className={getRatingColor(feedback.rating)}>
                  <Star size={14} className="mr-1 fill-current" />
                  {feedback.rating} - {getRatingText(feedback.rating)}
                </Badge>
              </div>

              {feedback.comment && (
                <div className="pl-11">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    "{feedback.comment}"
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};