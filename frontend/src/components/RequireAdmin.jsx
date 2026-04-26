import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="panel">Checking your session...</div>;
  }

  if (!isAdmin) {
    return (
      <>
        <div className="page-header">
          <div>
            <h1 className="page-title">Access Restricted</h1>
            <div className="page-subtitle">You need admin privileges to view this page</div>
          </div>
        </div>
        <div className="panel">
          <div className="empty-state">
            <div className="empty-state-icon"><ShieldAlert size={28} /></div>
            <div className="empty-state-title">Not authorised</div>
            <div className="empty-state-sub">This page is available only for administrators.</div>
          </div>
        </div>
      </>
    );
  }

  return children;
}
