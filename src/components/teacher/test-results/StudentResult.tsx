import React from 'react';
import { CompletedTests } from '../../../modules/test';

interface StudentResultProps {
  result: CompletedTests;
}

const StudentResult: React.FC<StudentResultProps> = ({ result }) => {
  return (
    <div className="student-result">
      <h2>Test Result for Student ID: {result.student_id}</h2>
      <p><strong>Test ID:</strong> {result.test_id}</p>
      <p><strong>Points:</strong> {result.points}</p>
      <p><strong>Status:</strong> {result.status}</p>
      <p><strong>Submitted On:</strong> {new Date(result.created_at).toLocaleDateString()}</p>
      <p><strong>Last Updated:</strong> {new Date(result.updated_at).toLocaleDateString()}</p>
    </div>
  );
};

export default StudentResult;