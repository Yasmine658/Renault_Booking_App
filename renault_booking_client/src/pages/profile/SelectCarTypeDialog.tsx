import { Button } from '@/components/ui/button';
import { DialogContent } from '@/components/ui/dialog';

interface SelectCarTypeDialogProps {
  onSelectType: (type: 'local' | 'international') => void;
  onSelectExisting: (carId: string) => void;
  cars: any[];
}

export const SelectCarTypeDialog = ({ onSelectType, onSelectExisting, cars }: SelectCarTypeDialogProps) => {
  return (
    <DialogContent className="max-w-lg">
      <h3 className="text-lg font-semibold">Sélectionnez le type de voiture</h3>
      <div className="mt-4">
        <Button onClick={() => onSelectType('local')}>Voiture locale</Button>
        <Button onClick={() => onSelectType('international')}>Voiture internationale</Button>
      </div>

      <div className="mt-6">
        <h4 className="font-medium">Ou choisissez une voiture existante</h4>
        {cars.map((car) => (
          <Button
            key={car._id}
            className="block mt-2"
            onClick={() => onSelectExisting(car._id)}
          >
            {car.model}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
};
