import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function SortableItem({ id, children }: { id: string, children: React.ReactNode }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Using Tailwind for additional styles
    return (
        <div ref={setNodeRef} style={style} className="cursor-grab" {...attributes} {...listeners}>
            {children}
        </div>
    );
}