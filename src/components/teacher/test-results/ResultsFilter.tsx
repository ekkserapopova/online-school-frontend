import React from 'react';

interface ResultsFilterProps {
  status: string;
  setStatus: (status: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

const ResultsFilter: React.FC<ResultsFilterProps> = ({
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="results-filter">
      <h3>Filter Results</h3>
      <div className="results-filter__controls">
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="failed">Failed</option>
          </select>
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default ResultsFilter;