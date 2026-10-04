import React from 'react';
import { ListTodo, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const { total = 0, byStatus = {}, completionRate = '0%' } = stats || {};
  const pending = byStatus.pending || 0;
  const inProgress = byStatus['in-progress'] || 0;
  const completed = byStatus.completed || 0;

  const numericRate = parseFloat(completionRate) || 0;

  return (
    <div className="stats-grid" id="stats-overview-grid">
      <div className="stat-card" id="stat-card-total">
        <div className="stat-icon-wrapper stat-icon-total">
          <ListTodo size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
      </div>

      <div className="stat-card" id="stat-card-pending">
        <div className="stat-icon-wrapper stat-icon-pending">
          <Clock size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
      </div>

      <div className="stat-card" id="stat-card-progress">
        <div className="stat-icon-wrapper stat-icon-progress">
          <Loader2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
      </div>

      <div className="stat-card" id="stat-card-completed">
        <div className="stat-icon-wrapper stat-icon-completed">
          <CheckCircle2 size={24} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="progress-bar-container" id="completion-progress-card">
        <div className="progress-header">
          <span>Overall Completion Rate</span>
          <strong style={{ color: 'var(--accent-emerald)' }}>{completionRate}</strong>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, numericRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
