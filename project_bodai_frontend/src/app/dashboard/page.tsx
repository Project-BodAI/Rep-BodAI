"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Calendar, TrendingUp, Dumbbell, BarChart3, Target, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'cardio';
  muscle: string;
}

interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

interface Workout {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
}

const exercises: Exercise[] = [
  { id: '1', name: 'Bench Press', category: 'chest', muscle: 'Chest' },
  { id: '2', name: 'Incline Dumbbell Press', category: 'chest', muscle: 'Upper Chest' },
  { id: '3', name: 'Push-ups', category: 'chest', muscle: 'Chest' },
  { id: '4', name: 'Deadlift', category: 'back', muscle: 'Back' },
  { id: '5', name: 'Pull-ups', category: 'back', muscle: 'Lats' },
  { id: '6', name: 'Barbell Rows', category: 'back', muscle: 'Mid Back' },
  { id: '7', name: 'Squats', category: 'legs', muscle: 'Quadriceps' },
  { id: '8', name: 'Leg Press', category: 'legs', muscle: 'Legs' },
  { id: '9', name: 'Romanian Deadlift', category: 'legs', muscle: 'Hamstrings' },
  { id: '10', name: 'Overhead Press', category: 'shoulders', muscle: 'Shoulders' },
  { id: '11', name: 'Lateral Raises', category: 'shoulders', muscle: 'Side Delts' },
  { id: '12', name: 'Bicep Curls', category: 'arms', muscle: 'Biceps' },
  { id: '13', name: 'Tricep Dips', category: 'arms', muscle: 'Triceps' },
  { id: '14', name: 'Plank', category: 'core', muscle: 'Core' },
  { id: '15', name: 'Russian Twists', category: 'core', muscle: 'Abs' },
];

const categoryColors = {
  chest: 'bg-red-100 text-red-800',
  back: 'bg-blue-100 text-blue-800',
  legs: 'bg-green-100 text-green-800',
  shoulders: 'bg-yellow-100 text-yellow-800',
  arms: 'bg-purple-100 text-purple-800',
  core: 'bg-pink-100 text-pink-800',
  cardio: 'bg-orange-100 text-orange-800'
};

export default function FitnessTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'workout' | 'history' | 'progress'>('workout');

  // Initialize a new workout for the selected date
  const initializeWorkout = () => {
    const existingWorkout = workouts.find(w => w.date === selectedDate);
    if (existingWorkout) {
      setCurrentWorkout(existingWorkout);
    } else {
      const newWorkout: Workout = {
        id: Date.now().toString(),
        date: selectedDate,
        exercises: []
      };
      setCurrentWorkout(newWorkout);
    }
  };

  useEffect(() => {
    initializeWorkout();
  }, [selectedDate, workouts]);

  const addExerciseToWorkout = () => {
    if (!selectedExercise || !currentWorkout) return;
    
    const exercise = exercises.find(e => e.id === selectedExercise);
    if (!exercise) return;

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
      completed: false
    };

    const workoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [newSet]
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, workoutExercise]
    });

    setShowAddExercise(false);
    setSelectedExercise('');
  };

  const addSetToExercise = (exerciseIndex: number) => {
    if (!currentWorkout) return;

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      reps: 0,
      weight: 0,
      completed: false
    };

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex].sets.push(newSet);

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    if (!currentWorkout) return;

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  const toggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    if (!currentWorkout) return;

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed = 
      !updatedExercises[exerciseIndex].sets[setIndex].completed;

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises
    });
  };

  const saveWorkout = () => {
    if (!currentWorkout) return;

    const updatedWorkouts = workouts.filter(w => w.id !== currentWorkout.id);
    setWorkouts([...updatedWorkouts, currentWorkout]);
  };

  const getProgressData = (exerciseName: string) => {
    const exerciseData = workouts
      .filter(w => w.exercises.some(e => e.exerciseName === exerciseName))
      .map(w => {
        const exercise = w.exercises.find(e => e.exerciseName === exerciseName);
        const maxWeight = Math.max(...exercise!.sets.map(s => s.weight));
        return {
          date: new Date(w.date).toLocaleDateString(),
          weight: maxWeight
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return exerciseData;
  };

  const getUniqueExercisesFromHistory = () => {
    const exerciseNames = new Set<string>();
    workouts.forEach(w => {
      w.exercises.forEach(e => {
        exerciseNames.add(e.exerciseName);
      });
    });
    return Array.from(exerciseNames);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Fitness Tracker</h1>
                <p className="text-gray-300">Track your workouts and monitor progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'workout'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Today's Workout</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Workout History</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Progress</span>
              </div>
            </button>
          </div>
        </div>

        {/* Workout Tab */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {/* Current Workout */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Workout for {new Date(selectedDate).toLocaleDateString()}
                </h2>
                <button
                  onClick={() => setShowAddExercise(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Exercise</span>
                </button>
              </div>

              {currentWorkout?.exercises.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No exercises added yet. Click "Add Exercise" to get started!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currentWorkout?.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-white">{exercise.exerciseName}</h3>
                        <button
                          onClick={() => addSetToExercise(exerciseIndex)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          + Add Set
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-400 mb-2">
                          <span>Set</span>
                          <span>Weight (kg)</span>
                          <span>Reps</span>
                          <span>Done</span>
                        </div>
                        
                        {exercise.sets.map((set, setIndex) => (
                          <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
                            <span className="text-sm text-gray-400">{setIndex + 1}</span>
                            <input
                              type="number"
                              value={set.weight || ''}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                              className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                            <input
                              type="number"
                              value={set.reps || ''}
                              onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                              className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                            <input
                              type="checkbox"
                              checked={set.completed}
                              onChange={() => toggleSetComplete(exerciseIndex, setIndex)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={saveWorkout}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Save Workout
                  </button>
                </div>
              )}
            </div>

            {/* Add Exercise Modal */}
            {showAddExercise && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-4 text-white">Add Exercise</h3>
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an exercise</option>
                    {exercises.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name} ({exercise.muscle})
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddExercise(false)}
                      className="flex-1 border border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addExerciseToWorkout}
                      disabled={!selectedExercise}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Workout History</h2>
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No workout history yet. Complete your first workout to see it here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(workout => (
                    <div key={workout.id} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">
                          {new Date(workout.date).toLocaleDateString()}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {workout.exercises.length} exercises
                        </span>
                      </div>
                      <div className="space-y-2">
                        {workout.exercises.map((exercise, index) => (
                          <div key={index} className="text-sm text-gray-300">
                            <span className="font-medium">{exercise.exerciseName}</span>
                            <span className="ml-2 text-gray-400">
                              {exercise.sets.length} sets completed
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-6">Progress Tracking</h2>
            {getUniqueExercisesFromHistory().length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Complete some workouts to see your progress!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {getUniqueExercisesFromHistory().map(exerciseName => {
                  const progressData = getProgressData(exerciseName);
                  if (progressData.length < 2) return null;
                  
                  return (
                    <div key={exerciseName} className="border border-gray-600 rounded-lg p-4 bg-gray-750">
                      <h3 className="font-medium text-white mb-4">{exerciseName} Progress</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" tick={{ fill: '#9CA3AF' }} />
                            <YAxis tick={{ fill: '#9CA3AF' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1F2937', 
                                borderColor: '#374151', 
                                color: '#fff' 
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}