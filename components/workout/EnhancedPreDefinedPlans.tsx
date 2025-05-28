import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Badge, Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import plan_styles from '@/styles/plan_style';
import { EnhancedWorkoutPlan, WorkoutCategory } from '@/types/enhanced-workout';
import { workoutCategories, enhancedWorkoutPlans } from '@/constants/advanced-workouts';

interface EnhancedPreDefinedPlansProps {
  onSelectPlan: (plan: EnhancedWorkoutPlan, selectedDays: string[]) => void;
  isInitialView?: boolean;
  onBackToCurrentPlan?: () => void;
  onCreateCustomPlan?: () => void;
}

export default function EnhancedPreDefinedPlans({ 
  onSelectPlan, 
  isInitialView = false,
  onBackToCurrentPlan,
  onCreateCustomPlan 
}: EnhancedPreDefinedPlansProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<EnhancedWorkoutPlan | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showDaySelection, setShowDaySelection] = useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const filteredPlans = enhancedWorkoutPlans.filter(plan => {
    if (selectedCategory && plan.category !== selectedCategory) return false;
    if (selectedDifficulty && plan.level !== selectedDifficulty) return false;
    return true;
  });

  const getDifficultyColor = (rating: number) => {
    if (rating <= 3) return '#27ae60';
    if (rating <= 6) return '#f39c12';
    return '#e74c3c';
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = workoutCategories.find(c => c.name.includes(category) || category.includes(c.id));
    return categoryData?.icon || 'fitness';
  };

  const handlePlanSelect = (plan: EnhancedWorkoutPlan) => {
    setSelectedPlan(plan);
    setSelectedDays([]);
    setShowDaySelection(true);
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        if (selectedPlan && prev.length < selectedPlan.daysPerWeek) {
          return [...prev, day];
        }
        return prev;
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedPlan && selectedDays.length === selectedPlan.daysPerWeek) {
      onSelectPlan(selectedPlan, selectedDays);
      setShowDaySelection(false);
      setSelectedPlan(null);
      setSelectedDays([]);
    }
  };

  const handleCancelSelection = () => {
    setShowDaySelection(false);
    setSelectedPlan(null);
    setSelectedDays([]);
  };

  if (showDaySelection && selectedPlan) {
    return (
      <ScrollView 
        style={plan_styles.content}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        
        <View style={styles.daySelectionContainer}>
          <Text h3 style={styles.daySelectionTitle}>Choose Your Workout Days</Text>
          <Text style={styles.daySelectionSubtitle}>
            Select {selectedPlan.daysPerWeek} days for "{selectedPlan.title}"
          </Text>
          <Text style={styles.daySelectionDescription}>
            {selectedDays.length} of {selectedPlan.daysPerWeek} days selected
          </Text>

          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCard,
                  selectedDays.includes(day) && styles.dayCardSelected,
                  selectedDays.length >= selectedPlan.daysPerWeek && !selectedDays.includes(day) && styles.dayCardDisabled
                ]}
                onPress={() => toggleDaySelection(day)}
                disabled={selectedDays.length >= selectedPlan.daysPerWeek && !selectedDays.includes(day)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(day) && styles.dayTextSelected
                ]}>
                  {day.substring(0, 3)}
                </Text>
                <Text style={[
                  styles.dayFullText,
                  selectedDays.includes(day) && styles.dayTextSelected
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.daySelectionButtons}>
            <Button
              title="Cancel"
              type="outline"
              onPress={handleCancelSelection}
              containerStyle={styles.cancelButtonContainer}
              buttonStyle={styles.cancelDayButton}
              titleStyle={styles.cancelDayButtonText}
            />
            <Button
              title="Confirm Selection"
              onPress={handleConfirmSelection}
              disabled={selectedDays.length !== selectedPlan.daysPerWeek}
              containerStyle={styles.confirmButtonContainer}
              buttonStyle={[
                styles.confirmDayButton,
                selectedDays.length !== selectedPlan.daysPerWeek && styles.confirmDayButtonDisabled
              ]}
              titleStyle={styles.confirmDayButtonText}
            />
          </View>

          {/* Plan Summary */}
          <View style={styles.planSummary}>
            <Text style={styles.planSummaryTitle}>Plan Summary</Text>
            <Text style={styles.planSummaryText}>
              <Text style={styles.planSummaryLabel}>Program: </Text>{selectedPlan.title}
            </Text>
            <Text style={styles.planSummaryText}>
              <Text style={styles.planSummaryLabel}>Level: </Text>{selectedPlan.level}
            </Text>
            <Text style={styles.planSummaryText}>
              <Text style={styles.planSummaryLabel}>Duration: </Text>{selectedPlan.estimatedTimePerSession}
            </Text>
            <Text style={styles.planSummaryText}>
              <Text style={styles.planSummaryLabel}>Frequency: </Text>{selectedPlan.daysPerWeek} days per week
            </Text>
            {selectedDays.length > 0 && (
              <Text style={styles.planSummaryText}>
                <Text style={styles.planSummaryLabel}>Your Days: </Text>{selectedDays.join(', ')}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={plan_styles.content}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      
      {!isInitialView && onBackToCurrentPlan && (
        <View style={plan_styles.header}>
          <Button
            title="Back to Plan"
            type="outline"
            onPress={onBackToCurrentPlan}
            containerStyle={[plan_styles.backButton]}
            buttonStyle={[plan_styles.outlineButton]}
            titleStyle={[plan_styles.outlineButtonText]}
            icon={{
              name: 'arrow-left',
              type: 'feather',
              size: 20,
              color: '#e74c3c',
              style: { marginRight: 10 }
            }}
          />
        </View>
      )}

      {/* AI Custom Plan Section */}
      <TouchableOpacity 
        style={plan_styles.aiSection}
        onPress={() => router.push('/questionnaire/basic-info')}
      >
        <Text h3 style={plan_styles.aiTitle}>AI-Tailored Workout Plan</Text>
        <Text style={plan_styles.aiDescription}>
          Get a personalized workout plan based on your goals, fitness level, and preferences
        </Text>
        <Button
          title="Create Custom Plan"
          onPress={() => router.push('/questionnaire/basic-info')}
          containerStyle={plan_styles.aiButton}
          buttonStyle={plan_styles.aiButtonStyle}
          titleStyle={plan_styles.buttonTitleStyle}
          icon={{
            name: 'cpu',
            type: 'feather',
            size: 20,
            color: 'white',
            style: { marginRight: 10 }
          }}
        />
      </TouchableOpacity>

      {/* Manual Custom Plan Section */}
      {onCreateCustomPlan && (
        <TouchableOpacity 
          style={[plan_styles.aiSection, { backgroundColor: 'rgba(52, 152, 219, 0.1)', borderColor: 'rgba(52, 152, 219, 0.3)' }]}
          onPress={onCreateCustomPlan}
        >
          <Text h3 style={[plan_styles.aiTitle, { color: '#3498db' }]}>Create Your Own Plan</Text>
          <Text style={plan_styles.aiDescription}>
            Build a workout plan from scratch, tailored to your exact preferences and split.
          </Text>
          <Button
            title="Start Building"
            onPress={onCreateCustomPlan}
            containerStyle={plan_styles.aiButton}
            buttonStyle={[plan_styles.aiButtonStyle, { backgroundColor: '#3498db' }]}
            titleStyle={plan_styles.buttonTitleStyle}
            icon={{
              name: 'pencil-plus-outline',
              type: 'material-community',
              size: 20,
              color: 'white',
              style: { marginRight: 10 }
            }}
          />
        </TouchableOpacity>
      )}

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text h4 style={plan_styles.preDefinedTitle}>Filter Workout Plans</Text>
        
        {/* Category Filter */}
        <Text style={styles.filterTitle}>By Category:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, selectedCategory === null && styles.filterChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterChipText, selectedCategory === null && styles.filterChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {workoutCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.filterChip, selectedCategory === category.id && styles.filterChipActive]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[styles.filterChipText, selectedCategory === category.id && styles.filterChipTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Difficulty Filter */}
        <Text style={styles.filterTitle}>By Level:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[styles.filterChip, selectedDifficulty === null && styles.filterChipActive]}
            onPress={() => setSelectedDifficulty(null)}
          >
            <Text style={[styles.filterChipText, selectedDifficulty === null && styles.filterChipTextActive]}>
              All Levels
            </Text>
          </TouchableOpacity>
          {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.filterChip, selectedDifficulty === level && styles.filterChipActive]}
              onPress={() => setSelectedDifficulty(level)}
            >
              <Text style={[styles.filterChipText, selectedDifficulty === level && styles.filterChipTextActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Enhanced Workout Plans */}
      <Text h4 style={plan_styles.preDefinedTitle}>
        {filteredPlans.length} Workout Plan{filteredPlans.length !== 1 ? 's' : ''} Available
      </Text>
      
      <View style={styles.plansContainer}>
        {filteredPlans.map((plan) => (
          <Card key={plan.id} containerStyle={styles.enhancedPlanCard}>
            <View style={styles.planHeader}>
              <View style={styles.planTitleSection}>
                <Text style={styles.enhancedPlanTitle}>{plan.title}</Text>
                <Text style={styles.planSubCategory}>{plan.subCategory}</Text>
              </View>
              <View style={styles.difficultyBadge}>
                <Badge
                  value={plan.difficultyRating}
                  badgeStyle={{
                    backgroundColor: getDifficultyColor(plan.difficultyRating),
                    borderRadius: 15,
                    paddingHorizontal: 8
                  }}
                  textStyle={{ fontSize: 12, fontWeight: 'bold' }}
                />
              </View>
            </View>

            <View style={styles.planMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Level:</Text>
                <Text style={styles.metaValue}>{plan.level}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Duration:</Text>
                <Text style={styles.metaValue}>{plan.estimatedTimePerSession}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Days/Week:</Text>
                <Text style={styles.metaValue}>{plan.daysPerWeek}</Text>
              </View>
            </View>

            <Text style={styles.enhancedPlanDescription}>{plan.description}</Text>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {plan.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Equipment */}
            <View style={styles.equipmentSection}>
              <Text style={styles.equipmentTitle}>Equipment needed:</Text>
              <Text style={styles.equipmentText}>
                {plan.equipment.join(', ')}
              </Text>
            </View>

            {/* Toggle Details */}
            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={() => setShowDetails(showDetails === plan.id ? null : plan.id)}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails === plan.id ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>

            {/* Expanded Details */}
            {showDetails === plan.id && (
              <View style={styles.expandedDetails}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Benefits:</Text>
                  {plan.benefits.map((benefit, index) => (
                    <Text key={index} style={styles.detailItem}>• {benefit}</Text>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>What to Expect:</Text>
                  {plan.whatToExpect?.map((expectation, index) => (
                    <Text key={index} style={styles.detailItem}>• {expectation}</Text>
                  ))}
                </View>

                {plan.prerequisites && plan.prerequisites.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Prerequisites:</Text>
                    {plan.prerequisites.map((prereq, index) => (
                      <Text key={index} style={styles.detailItem}>• {prereq}</Text>
                    ))}
                  </View>
                )}
              </View>
            )}

            <Button
              title="Select This Plan"
              onPress={() => handlePlanSelect(plan)}
              containerStyle={styles.selectButton}
              buttonStyle={[plan_styles.aiButtonStyle, { backgroundColor: workoutCategories.find(c => c.id === selectedCategory)?.color || '#e74c3c' }]}
              titleStyle={plan_styles.buttonTitleStyle}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = {
  filterSection: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  filterTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 15,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  filterChipText: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
    fontWeight: 'bold' as const,
  },
  enhancedPlanCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 0,
    margin: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  planHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
    padding: 15,
    paddingBottom: 0,
  },
  planTitleSection: {
    flex: 1,
    marginRight: 10,
  },
  enhancedPlanTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 4,
    flexWrap: 'wrap' as const,
  },
  planSubCategory: {
    color: '#e74c3c',
    fontSize: 13,
    fontStyle: 'italic' as const,
  },
  difficultyBadge: {
    marginLeft: 5,
    alignSelf: 'flex-start' as const,
  },
  planMeta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center' as const,
    minWidth: 0,
  },
  metaLabel: {
    color: '#e0e0e0',
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'center' as const,
  },
  metaValue: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
    flexWrap: 'wrap' as const,
  },
  enhancedPlanDescription: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  tagsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  tag: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: '#e74c3c',
    fontSize: 11,
    fontWeight: '500' as const,
  },
  equipmentSection: {
    marginBottom: 12,
    paddingHorizontal: 15,
  },
  equipmentTitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold' as const,
    marginBottom: 4,
  },
  equipmentText: {
    color: '#e0e0e0',
    fontSize: 12,
    lineHeight: 16,
  },
  detailsToggle: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center' as const,
  },
  detailsToggleText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: 'bold' as const,
  },
  expandedDetails: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailSectionTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold' as const,
    marginBottom: 6,
  },
  detailItem: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 3,
    paddingLeft: 8,
    lineHeight: 18,
  },
  selectButton: {
    margin: 15,
    marginTop: 0,
  },
  plansContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  // Day Selection Styles
  daySelectionContainer: {
    padding: 20,
  },
  daySelectionTitle: {
    color: 'white',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  daySelectionSubtitle: {
    color: '#e0e0e0',
    textAlign: 'center' as const,
    fontSize: 16,
    marginBottom: 8,
  },
  daySelectionDescription: {
    color: '#e74c3c',
    textAlign: 'center' as const,
    fontSize: 14,
    marginBottom: 25,
    fontWeight: 'bold' as const,
  },
  daysGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  dayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    margin: 6,
    width: 90,
    height: 65,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayCardSelected: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    borderColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dayCardDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.6,
  },
  dayText: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: 'bold' as const,
    marginBottom: 2,
  },
  dayFullText: {
    color: '#e0e0e0',
    fontSize: 10,
  },
  dayTextSelected: {
    color: 'white',
  },
  daySelectionButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 25,
    gap: 15,
  },
  cancelButtonContainer: {
    flex: 1,
  },
  confirmButtonContainer: {
    flex: 1,
  },
  cancelDayButton: {
    borderColor: '#e74c3c',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 10,
  },
  cancelDayButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  confirmDayButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  confirmDayButtonDisabled: {
    backgroundColor: 'rgba(231, 76, 60, 0.5)',
  },
  confirmDayButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  planSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  planSummaryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 15,
    textAlign: 'center' as const,
  },
  planSummaryText: {
    color: '#e0e0e0',
    fontSize: 14,
    marginBottom: 8,
  },
  planSummaryLabel: {
    color: 'white',
    fontWeight: 'bold' as const,
  },
}; 