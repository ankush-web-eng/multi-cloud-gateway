import { Check, AlertCircle, Clock } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
    const getStatusInfo = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { icon: <Clock size={14} />, color: 'bg-yellow-100 text-yellow-800' };
            case 'success':
                return { icon: <Check size={14} />, color: 'bg-green-100 text-green-800' };
            case 'failed':
                return { icon: <AlertCircle size={14} />, color: 'bg-red-100 text-red-800' };
            default:
                return { icon: <Clock size={14} />, color: 'bg-gray-100 text-gray-800' };
        }
    };

    const { icon, color } = getStatusInfo(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <span className="mr-1">{icon}</span>
            {status}
        </span>
    );
};