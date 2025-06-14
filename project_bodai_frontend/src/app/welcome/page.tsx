'use client';

import React, { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

// Type definitions
interface UserProfile {
  // Basic Info
  height: string;
  weight: string;
  age: string;
  
  // Health & History
  workoutHistory: string;
  medicalConditions: string;
  
  // Lifestyle
  dailyRoutines: string;
  lifestyle: string;
  
  // Goals
  primaryGoal: string;
  secondaryGoals: string[];
  
  // Equipment
  equipmentAvailability: string[];
  workoutLocation: string;
}

interface FormErrors {
  [key: string]: string;
}

const WelcomePage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [profile, setProfile] = useState<UserProfile>({
    height: '',
    weight: '',
    age: '',
    workoutHistory: '',
    medicalConditions: '',
    dailyRoutines: '',
    lifestyle: '',
    primaryGoal: '',
    secondaryGoals: [],
    equipmentAvailability: [],
    workoutLocation: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const goals = [
    'Fat Loss',
    'Muscle Building (Bulking)',
    'Maintenance',
    'Strength Building',
    'Endurance Improvement',
    'Athletic Performance',
    'General Fitness'
  ];

  const equipmentOptions = [
    'Home Gym (Full Equipment)',
    'Commercial Gym Access',
    'Basic Equipment (Dumbbells, Resistance Bands)',
    'Bodyweight Only',
    'Cardio Equipment (Treadmill, Bike)',
    'Olympic Barbell & Plates',
    'Kettlebells',
    'No Equipment Available'
  ];

  const workoutLocations = [
    'Home',
    'Commercial Gym',
    'Outdoor',
    'Office/Work',
    'Mixed Locations'
  ];

  const lifestyleOptions = [
    'Very Active (Physical job + regular exercise)',
    'Active (Regular exercise, desk job)',
    'Moderately Active (Light exercise 1-3 times/week)',
    'Sedentary (Minimal physical activity)',
    'Highly Variable (Schedule changes frequently)'
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>, field: 'secondaryGoals' | 'equipmentAvailability'): void => {
    const { value, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 0:
        if (!profile.height) newErrors.height = 'Height is required';
        if (!profile.weight) newErrors.weight = 'Weight is required';
        if (!profile.age) newErrors.age = 'Age is required';
        break;
      case 1:
        if (!profile.workoutHistory) newErrors.workoutHistory = 'Workout history is required';
        break;
      case 2:
        if (!profile.lifestyle) newErrors.lifestyle = 'Lifestyle information is required';
        if (!profile.dailyRoutines) newErrors.dailyRoutines = 'Daily routines information is required';
        break;
      case 3:
        if (!profile.primaryGoal) newErrors.primaryGoal = 'Primary goal is required';
        break;
      case 4:
        if (profile.equipmentAvailability.length === 0) newErrors.equipmentAvailability = 'Please select at least one equipment option';
        if (!profile.workoutLocation) newErrors.workoutLocation = 'Workout location is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = (): void => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('User Profile:', profile);
      alert('Profile setup completed successfully! Welcome to BodAI!');
      router.push('/dashboard'); //  Redirect to a dashboard page
      
      // Here you would typically redirect to the main app
    } catch (error) {
      console.error('Profile setup error:', error);
      alert('An error occurred while setting up your profile. Please try again.');
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    'Basic Info',
    'Health & History',
    'Lifestyle',
    'Goals',
    'Equipment'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">
                  Height (cm/ft)
                </label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  value={profile.height}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 175 cm or 5'9"
                />
                {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
              </div>

              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">
                  Weight (kg/lbs)
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={profile.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 70 kg or 154 lbs"
                />
                {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight}</p>}
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 25"
                  min="13"
                  max="120"
                />
                {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Health & Workout History</h3>
            
            <div>
              <label htmlFor="workoutHistory" className="block text-sm font-medium text-gray-300 mb-2">
                Workout Experience & History
              </label>
              <textarea
                id="workoutHistory"
                name="workoutHistory"
                value={profile.workoutHistory}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe your workout experience, how long you've been training, types of exercises you're familiar with, any sports background, etc."
              />
              {errors.workoutHistory && <p className="text-red-400 text-sm mt-1">{errors.workoutHistory}</p>}
            </div>

            <div>
              <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-300 mb-2">
                Medical Conditions & Injuries
              </label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                value={profile.medicalConditions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Any medical conditions, past injuries, physical limitations, or medications that might affect your workout routine. Write 'None' if not applicable."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Daily Lifestyle</h3>
            
            <div>
              <label htmlFor="lifestyle" className="block text-sm font-medium text-gray-300 mb-2">
                Activity Level
              </label>
              <select
                id="lifestyle"
                name="lifestyle"
                value={profile.lifestyle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select your activity level</option>
                {lifestyleOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              {errors.lifestyle && <p className="text-red-400 text-sm mt-1">{errors.lifestyle}</p>}
            </div>

            <div>
              <label htmlFor="dailyRoutines" className="block text-sm font-medium text-gray-300 mb-2">
                Daily Routines & Schedule
              </label>
              <textarea
                id="dailyRoutines"
                name="dailyRoutines"
                value={profile.dailyRoutines}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Describe your typical day: work schedule, sleep patterns, meal times, commute, family commitments, preferred workout times, etc."
              />
              {errors.dailyRoutines && <p className="text-red-400 text-sm mt-1">{errors.dailyRoutines}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Fitness Goals</h3>
            
            <div>
              <label htmlFor="primaryGoal" className="block text-sm font-medium text-gray-300 mb-2">
                Primary Goal
              </label>
              <select
                id="primaryGoal"
                name="primaryGoal"
                value={profile.primaryGoal}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select your primary goal</option>
                {goals.map((goal, index) => (
                  <option key={index} value={goal}>{goal}</option>
                ))}
              </select>
              {errors.primaryGoal && <p className="text-red-400 text-sm mt-1">{errors.primaryGoal}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Secondary Goals (Optional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goals.filter(goal => goal !== profile.primaryGoal).map((goal, index) => (
                  <label key={index} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      value={goal}
                      checked={profile.secondaryGoals.includes(goal)}
                      onChange={(e) => handleCheckboxChange(e, 'secondaryGoals')}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-4">Equipment & Location</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available Equipment *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {equipmentOptions.map((equipment, index) => (
                  <label key={index} className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      value={equipment}
                      checked={profile.equipmentAvailability.includes(equipment)}
                      onChange={(e) => handleCheckboxChange(e, 'equipmentAvailability')}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-sm">{equipment}</span>
                  </label>
                ))}
              </div>
              {errors.equipmentAvailability && <p className="text-red-400 text-sm mt-1">{errors.equipmentAvailability}</p>}
            </div>

            <div>
              <label htmlFor="workoutLocation" className="block text-sm font-medium text-gray-300 mb-2">
                Primary Workout Location
              </label>
              <select
                id="workoutLocation"
                name="workoutLocation"
                value={profile.workoutLocation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select your primary workout location</option>
                {workoutLocations.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
              {errors.workoutLocation && <p className="text-red-400 text-sm mt-1">{errors.workoutLocation}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-3xl">🏋️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to BodAI!</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Lets create your personalized fitness profile to provide you with the most effective workout plans and nutrition guidance. 
            This quick setup will help our AI understand your unique needs, goals, and constraints to deliver customized recommendations 
            that fit perfectly into your lifestyle.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span 
                key={index} 
                className={`text-xs ${index <= currentStep ? 'text-purple-400' : 'text-gray-500'}`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Setting up your profile...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Next Step
              </button>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Need help? All information is kept private and secure. You can always update your profile later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;