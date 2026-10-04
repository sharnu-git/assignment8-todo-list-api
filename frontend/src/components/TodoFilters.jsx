import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export default function TodoFilters({ filters, onFilterChange }) {
  const statusTabs = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <div className="toolbar-card" id="todo-filters-toolbar">
      {/* Search Input */}
      <div className="search-box">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          id="search-todo-input"
          className="search-input"
          placeholder="Search tasks by title or description..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        {filters.search && (
          <button
            className="search-clear-btn"
            id="clear-search-btn"
            onClick={() => onFilterChange('search', '')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        {/* Status Filter Tabs */}
        <div className="status-tabs" role="tablist">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              id={`tab-status-${tab.value}`}
              role="tab"
              aria-selected={filters.status === tab.value}
              className={`tab-btn ${filters.status === tab.value ? 'active' : ''}`}
              onClick={() => onFilterChange('status', tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority and Sorting Selectors */}
        <div className="select-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--text-muted)" />
            <select
              id="filter-priority-select"
              className="filter-select"
              value={filters.priority}
              onChange={(e) => onFilterChange('priority', e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <select
            id="sort-by-select"
            className="filter-select"
            value={`${filters.sortBy}:${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split(':');
              onFilterChange('sort', { sortBy, order });
            }}
            aria-label="Sort tasks by"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="priority:desc">Priority (High to Low)</option>
            <option value="status:asc">Status</option>
            <option value="title:asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
