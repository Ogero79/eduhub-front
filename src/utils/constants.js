// src/utils/constants.js

import { useState, useEffect } from 'react';

export const years = [1, 2, 3, 4, 5, 6];
export const semesters = [1, 2, 3];
export const resourceTypes = [
  'Notes',
  'Past Paper',
  'Task',
];
export const genders = [
  'Male',
  'Female',
];

// Custom hook to fetch courses from the server
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      
      const courseNames = data.map(course => course.course_name);
      
      setCourses(courseNames);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);


  return { courses, loading, error };
};
