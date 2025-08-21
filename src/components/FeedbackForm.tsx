import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FeedbackFormProps {
  onSubmit: (feedback: { name: string; rating: number; comment: string }) => void;
}

export const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || rating === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e selecione uma avaliação.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({ name: name.trim(), rating, comment: comment.trim() });
      
      // Reset form
      setName('');
      setRating(0);
      setComment('');
      
      toast({
        title: "Feedback enviado!",
        description: "Obrigado por compartilhar sua opinião conosco.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-card to-radar-light/30 border-radar-primary/20 shadow-lg">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-radar-primary to-radar-secondary bg-clip-text text-transparent">
            Compartilhe seu Feedback
          </h2>
          <p className="text-muted-foreground">
            Sua opinião nos ajuda a melhorar continuamente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="transition-all focus:ring-2 focus:ring-radar-primary/20"
            />
          </div>

          <div className="space-y-3">
            <Label>Avaliação *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-all hover:scale-110 ${
                    star <= rating
                      ? 'text-radar-secondary'
                      : 'text-muted-foreground hover:text-radar-secondary/60'
                  }`}
                >
                  <Star
                    size={32}
                    className={star <= rating ? 'fill-current' : ''}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Muito insatisfeito"}
                {rating === 2 && "Insatisfeito"}
                {rating === 3 && "Neutro"}
                {rating === 4 && "Satisfeito"}
                {rating === 5 && "Muito satisfeito"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte-nos mais sobre sua experiência..."
              rows={4}
              className="transition-all focus:ring-2 focus:ring-radar-primary/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-radar-primary to-radar-primary-light hover:from-radar-primary/90 hover:to-radar-primary-light/90 text-primary-foreground shadow-lg transition-all hover:shadow-xl"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
          </Button>
        </form>
      </div>
    </Card>
  );
};