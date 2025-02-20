import { Tabs } from 'expo-router';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Tabs
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerTitleStyle: {
                color: 'white',
              },
              tabBarStyle: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderTopColor: 'rgba(255, 255, 255, 0.1)',
              },
              tabBarActiveTintColor: '#e74c3c',
              tabBarInactiveTintColor: '#999',
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                headerShown: false,
                tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
              }}
            />
            <Tabs.Screen
              name="workout-plan"
              options={{
                tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
              }}
            />
            <Tabs.Screen
              name="form-analysis"
              options={{
                title: "Form Analysis",
                tabBarIcon: ({ color }) => <TabBarIcon name="video-camera" color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
              }}
            />
          </Tabs>
        </View>
      </ImageBackground>
    </View>
  );
}

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});