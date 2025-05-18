import React from 'react';
import { CompletedTests } from '../../../modules/test';

interface ResultsTableProps {
  results: CompletedTests[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Test ID</th>
          <th>Student ID</th>
          <th>Points</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.id}>
            <td>{result.id}</td>
            <td>{result.test_id}</td>
            <td>{result.student_id}</td>
            <td>{result.points}</td>
            <td>{result.status}</td>
            <td>{new Date(result.created_at).toLocaleString()}</td>
            <td>{new Date(result.updated_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;