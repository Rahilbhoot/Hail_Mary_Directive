import React from 'react';
import { TelemetryStats } from '../components/dashboard/TelemetryStats';
import { SessionManager } from '../components/dashboard/SessionManager';
import { OperativesList } from '../components/dashboard/OperativesList';

interface DashboardViewProps {
  onOpenComms: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenComms }) => {
  return (
    <div style={{ padding: '0 28px 36px 28px' }}>
      {/* HUD Telemetry Stats */}
      <TelemetryStats />

      {/* Main Grid: Session Manager (2 cols) + Operatives Roster (1 col) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <div style={{ flex: 2 }}>
          <SessionManager onOpenComms={onOpenComms} />
        </div>
        <div style={{ flex: 1 }}>
          <OperativesList />
        </div>
      </div>
    </div>
  );
};
