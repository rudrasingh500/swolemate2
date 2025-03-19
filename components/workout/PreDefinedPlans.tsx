import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { router } from 'expo-router';
import plan_styles from '@/styles/plan_style';
import { PreDefinedPlan } from '@/types/workout';
import { preDefinedPlans } from '@/constants/workout';

interface PreDefinedPlansProps {
  onSelectPlan: (plan: PreDefinedPlan) => void;
  isInitialView?: boolean;
  onBackToCurrentPlan?: () => void;
}

export default function PreDefinedPlans({ 
  onSelectPlan, 
  isInitialView = false,
  onBackToCurrentPlan
}: PreDefinedPlansProps) {
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

      <Text h4 style={plan_styles.preDefinedTitle}>Pre-defined Workout Plans</Text>
      <View style={plan_styles.plansGrid}>
        {preDefinedPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={plan_styles.planCard}
            onPress={() => onSelectPlan(plan)}
          >
            <Text style={plan_styles.planTitle}>{plan.title}</Text>
            <Text style={plan_styles.planLevel}>{plan.level}</Text>
            <Text style={plan_styles.planDescription}>{plan.description}</Text>
            <Text style={plan_styles.planCategory}>{plan.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}